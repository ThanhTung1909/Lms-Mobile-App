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

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý event thanh toán thành công
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { userId, courseId } = paymentIntent.metadata;

    try {
      // Cập nhật trạng thái payment
      await db.Payment.update(
        { status: "succeeded" },
        { where: { stripePaymentId: paymentIntent.id } }
      );

      // Ghi nhận enrollment
      await db.Enrollment.create({
        userId,
        courseId,
        status: "active",
      });

      console.log(`User ${userId} đã mua khoá học ${courseId}`);
    } catch (err) {
      console.error("Lỗi khi xử lý webhook:", err);
    }
  }

  res.json({ received: true });
};
