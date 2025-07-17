import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AboutScreen() {
  const isDark = useColorScheme() === 'dark';

  return (
    <>
     
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <Text style={[styles.heading, isDark && styles.darkText]}>
          आयुर्वेद-शब्दार्थबोधिका
        </Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Welcome to your Sanskrit Ayurvedic Dictionary App.
        </Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          This app helps you find Ayurvedic meanings, references, and traditional Sanskrit words with ease.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
});
