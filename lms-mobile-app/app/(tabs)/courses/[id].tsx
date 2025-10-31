
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Course Detail Screen</Text>
      <Text>Course ID: {id}</Text>
    </View>
  );
}
