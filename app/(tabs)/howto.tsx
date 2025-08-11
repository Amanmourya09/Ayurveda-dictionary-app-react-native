import { Stack } from 'expo-router';
import { ScrollView, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HowToUseScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'How To ' }} />
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.heading}>How to Use</Text>
        <Text style={styles.heading2}>आयुर्वेद-शब्दार्थबोधिका</Text>
        
        <Text style={styles.step}>🔍 1. Type a Sanskrit word in either Devnagri or Roman Script.</Text>
        <Text style={styles.step}>🗂 2. Use the filters (Word, Description, Reference, Book) to refine your search.</Text>
        <Text style={styles.step}>⌨️ 3. Tap the keyboard icon to use the built-in Hindi keyboard.</Text>
        <Text style={styles.step}>🕘 4. Your recent searches appear below the input for quick access.</Text>
        <Text style={styles.step}>📖 5. Tap on a result to view its meaning, reference, and book details.</Text>
        <Text style={styles.step}>❤️ 6. Tap the heart icon to save a word to your favorites.</Text>
        <Text style={styles.step}>🔊 7. Tap the speaker icon to hear the word spoken aloud.</Text>
        <Text style={styles.step}>📋 8. Tap the copy icon to copy the word or its meaning.</Text>

        <Text style={[styles.step, { marginTop: 20, fontWeight: '600' }]}>
          Enjoy learning and exploring Ayurveda through words!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 45,
  },
  heading: {
    paddingTop:10,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: '#2d3436',
    
  },
  heading2: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#2d3436',
    
  },
  step: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
    color: '#333',
  },
});
