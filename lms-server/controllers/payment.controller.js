import Stripe from "stripe";
import db from "../models/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Kiểm tra khoá học có tồn tại không
    const course = await db.Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Khoá học không tồn tại",
      });
    }

    // Tạo PaymentIntent trên Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100), // giá tính bằng cent
      currency: "usd",
      metadata: {
        userId,
        courseId,
      },
      description: `Thanh toán khoá học ${course.title}`,
      automatic_payment_methods: { enabled: true },
    });

    // Ghi log giao dịch (tuỳ chọn)
    await db.Payment.create({
      userId,
      courseId,
      stripePaymentId: paymentIntent.id,
      amount: course.price,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      message: "Tạo PaymentIntent thành công",
    });
  } catch (error) {
    console.error("Stripe createPaymentIntent error:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể tạo PaymentIntent",
      error: error.message,
    });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log("🔹 Webhook received!");
  console.log("🔹 Sig:", sig ? "Yes" : "No");
  console.log(
    "🔹 Body Type:",
    Buffer.isBuffer(req.body) ? "Buffer" : typeof req.body
  );

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const paymentIntent = event.data.object;

  switch (event.type) {
    case "payment_intent.succeeded": {
      const { userId, courseId } = paymentIntent.metadata;
      const amountPaid = paymentIntent.amount / 100;

      console.log(
        `💰 Payment succeeded for User ${userId}, Course ${courseId}, Amount: ${amountPaid}`
      );

      try {
        await db.Payment.update(
          { status: "succeeded" },
          { where: { stripePaymentId: paymentIntent.id } }
        );
        const existingEnrollment = await db.Enrollment.findOne({
          where: { userId, courseId },
        });

        if (!existingEnrollment) {
          await db.Enrollment.create({
            userId,
            courseId,
            status: "active",
            pricePaid: amountPaid, 
            enrolledAt: new Date(), 
          });
          console.log("✅ Enrollment created successfully.");
        }
      } catch (err) {
        console.error("❌ Error updating DB on success:", err);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const { userId, courseId } = paymentIntent.metadata;
      const errorMessage =
        paymentIntent.last_payment_error?.message || "Unknown error";

      console.log(`❌ Payment failed for User ${userId}: ${errorMessage}`);

      try {
        await db.Payment.update(
          {
            status: "failed",
          },
          { where: { stripePaymentId: paymentIntent.id } }
        );
      } catch (err) {
        console.error("❌ Error updating DB on failure:", err);
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
