import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import API from '../utils/api';

interface DictionaryEntry {
  Word: string;
  Gender?: string;
  Description?: string;
  Reference?: string;
  Meaning?: string;
  Book?: string;
}

export default function ResultsScreen() {
  const { word, filter } = useLocalSearchParams();
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useFocusEffect(
    useCallback(() => {
      loadFavorites(); // refresh on screen focus
    }, [])
  );

  useEffect(() => {
    fetchResults();
  }, [word, filter]);


  const fetchResults = async () => {
    if (!word) return;
    setLoading(true);
    try {
      const params: any = {
        limit: 63000,
      };

      if (!filter) {
        // No filter selected — search by Word by default
        params.Book = 'Ayurveda Shabdkosh';
        params.Word = word;
      } else if (filter === 'Book') {
        params.Book = word;
      } else {
        params.Book = 'Ayurveda Shabdkosh'; // default book
        params[filter as string] = word;
      }


      const response = await API.get('/index.php', { params });


      if (response.data.status === "success") {
        const allResults = response.data.data || [];
        setResults(allResults);
        setTotalPages(Math.ceil(allResults.length / itemsPerPage));
        setCurrentPage(1);
      } else {
        setResults([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component remains the same ...

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (term: string) => {
    try {
      const updated = favorites.includes(term)
        ? favorites.filter(item => item !== term)
        : [...favorites, term];
      setFavorites(updated);
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const speak = (text: string) => {
    Speech.speak(text, {
      language: 'sa-IN',
      pitch: 1.0,
      rate: 0.9,
      voice: 'com.google.android.tts:sa-in-x-saa-local',

    });
  };

  const copyToClipboard = async (text: string, type: 'word' | 'meaning') => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert(
        'Copied!',
        type === 'word'
          ? 'Word copied to clipboard'
          : 'Description copied to clipboard',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPaginatedResults = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return results.slice(startIndex, endIndex);
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.darkBg]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#121212' : '#f8faff'} />
      <Stack.Screen options={{
        headerTitle: `Results for "${word}"`,
        headerBackTitle: 'Back'
      }} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : results.length === 0 ? (
          <Text style={[styles.noResults, isDark && styles.lightText]}>
            No results found for "{word}"
          </Text>
        ) : (
          <>
            <Text style={[styles.searchInfo, isDark && styles.lightText]}>
              Showing {results.length} results for "{word}"
            </Text>

            {getPaginatedResults().map((result, index) => (
              <View key={index} style={[styles.resultCard, isDark && styles.darkCard]}>
                <View style={styles.resultHeader}>
                  <Text style={[styles.word, isDark && styles.lightText]}>
                    {result.Word}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => copyToClipboard(result.Word, 'word')}>
                      <Ionicons name="copy-outline" size={24} color={isDark ? '#fff' : '#555'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => speak(result.Word)}>
                      <Ionicons name="volume-high" size={24} color={isDark ? '#fff' : '#555'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleFavorite(result.Word)}>
                      <Ionicons
                        name={favorites.includes(result.Word) ? 'heart' : 'heart-outline'}
                        size={24}
                        color={favorites.includes(result.Word) ? 'red' : (isDark ? '#aaa' : '#555')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {result.Gender && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.label, isDark && styles.lightText]}>Gender:</Text>
                    <Text style={[styles.value, isDark && styles.lightText]}>{result.Gender}</Text>
                  </View>
                )}

                {result.Description && (
                  <View style={styles.detailRow}>
                    <View style={styles.meaningHeader}>
                      <Text style={[styles.label, isDark && styles.lightText]}>Description:</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(result.Description || '', 'meaning')} style={styles.copyButton}>
                        <Ionicons name="copy-outline" size={20} color={isDark ? '#fff' : '#555'} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.value, isDark && styles.lightText]}>{result.Description}</Text>
                  </View>
                )}

                {result.Reference && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.label, isDark && styles.lightText]}>Reference:</Text>
                    <Text style={[styles.value, isDark && styles.lightText]}>{result.Reference}</Text>
                  </View>
                )}

                {result.Meaning && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.label, isDark && styles.lightText]}>Meaning:</Text>
                    <Text style={[styles.value, isDark && styles.lightText]}>{result.Meaning}</Text>
                  </View>
                )}

                {result.Book && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.label, isDark && styles.lightText]}>Book:</Text>
                    <Text style={[styles.value, isDark && styles.lightText]}>{result.Book}</Text>
                  </View>
                )}
              </View>
            ))}

            {totalPages > 1 && (
              <View style={[styles.bottomPagination, isDark && styles.darkPagination]}>
                <TouchableOpacity
                  onPress={goToPrevPage}
                  disabled={currentPage === 1}
                  style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                >
                  <Ionicons name="chevron-back" size={24} color={currentPage === 1 ? '#ccc' : (isDark ? '#fff' : '#00796b')} />
                </TouchableOpacity>
                <Text style={[styles.pageText, isDark && styles.lightText]}>
                  Page {currentPage} of {totalPages}
                </Text>
                <TouchableOpacity
                  onPress={goToNextPage}
                  disabled={currentPage === totalPages}
                  style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                >
                  <Ionicons name="chevron-forward" size={24} color={currentPage === totalPages ? '#ccc' : (isDark ? '#fff' : '#00796b')} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8faff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  darkBg: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  loader: {
    marginTop: 50,
  },
  searchInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  noResults: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#555',
  },
  lightText: {
    color: '#fff',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
    flex: 1,
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  detailRow: {
    marginBottom: 12,
  },
  meaningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  copyButton: {
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  bottomPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  darkPagination: {
    backgroundColor: '#2a2a2a',
  },
  pageButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageText: {
    marginHorizontal: 15,
    color: '#555',
    fontSize: 16,
  },
});