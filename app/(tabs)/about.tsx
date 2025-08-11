import { View, Text, StyleSheet, StatusBar, Platform, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AboutScreen() {
  const isDark = useColorScheme() === 'dark';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={[styles.container, isDark && styles.darkContainer]}>
        <Text style={[styles.heading, isDark && styles.darkText]}>
          आयुर्वेद-शब्दार्थबोधिका
        </Text>

        {/* About Us Section */}
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>About Us</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Welcome to Ayurveda Shabdarthabodhika—an electronic collection of Ayurveda dictionaries that provides a combined search among various Ayurveda dictionaries. Ayurveda, the "Science of life," has been practiced for over 5,000 years, and its terminologies, which have been in use since the times of great preceptors such as Charaka, Sushruta, etc., have been collected and published in dictionary format by various scholars. Here, an attempt has been made to bring together the multiple dictionaries on Ayurveda onto a single platform for the use of students, scholars, and other enthusiasts of Ayurveda for their ready reference. This will serve as a resource for making the search for meanings of terminologies easier for use in understanding texts, translation works, etc.
        </Text>

        {/* Objectives Section */}
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Objectives</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          Ayurveda Shabdarthabodhika aims to:
        </Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>1. Be a ready reckoner to search and understand Ayurveda Terminologies and words related to Ayurveda.</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>2. Serve as an online resource accessible globally from your mobile and PC.</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>3. Collate the opinion of various dictionaries on a single word, thus bringing all the different meanings of the word together.</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>4. Serve as a tool for the study of Ayurveda and also as a reference for young scholars for undertaking translation works related to Ayurveda.</Text>

        {/* Key Features Section */}
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
          Key Features of Ayurveda Shabdarthabodhika
        </Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          1. Comprehensive Coverage: Since the Ayurveda Shabdarthabodhika is a collection of dictionaries, it will serve as a comprehensive repository of Ayurveda Terminologies and words related to Ayurveda.
        </Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          2. Easy Navigation: Ayurveda Shabdarthabodhika is very easy to navigate. With alphabetical listings and a search facility, words can be easily searched.
        </Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>
          3. Regular Updates: Since more and more dictionaries will be added occasionally, this will serve as a growing resource for Ayurveda enthusiasts.
        </Text>

        
       
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  copyright: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 40,
    marginBottom: Platform.OS === 'android' ? 20 : 40,
  },
  darkText: {
    color: '#fff',
  },
});
