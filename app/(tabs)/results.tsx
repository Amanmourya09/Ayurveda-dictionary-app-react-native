
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
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

export default function ResultsScreen() {
  const { word, filter } = useLocalSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadFavorites();
    fetchResults();
  }, [word, filter]);

  const fetchResults = async () => {
    if (!word) return;
    setLoading(true);
    try {
      const response = await API.get('/word', {
        params: {
          word: word,
          filter: filter || undefined
        }
      });

      if (response.data.success) {
        const allResults = response.data.results || [];
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

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  };

  const toggleFavorite = async (term: string) => {
    const updated = favorites.includes(term)
      ? favorites.filter(item => item !== term)
      : [...favorites, term];
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const speak = (text: string) => {
    Speech.speak(text, {
      language: 'hi-IN',
      pitch: 1.0,
      rate: 1.0,
    });
  };

  const copyToClipboard = async (text: string, type: 'word' | 'meaning') => {
    await Clipboard.setStringAsync(text);
    Alert.alert(
      'Copied!',
      type === 'word'
        ? 'Word copied to clipboard'
        : 'Meaning copied to clipboard',
      [{ text: 'OK' }]
    );
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
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#121212' : '#f8faff'} translucent={false} />
      <Stack.Screen options={{ headerShown: false }} />

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
            {/* Top: Only show styled "Showing results for..." */}
            <View style={styles.resultsHeaderOnly}>
              <Text style={[styles.searchInfo, isDark && styles.lightText]}>
                Showing {results.length} results for "{word}" {filter ? `in ${filter}` : ''}
              </Text>
            </View>

            {/* Paginated results */}
            {getPaginatedResults().map((result, index) => (
              <View key={index} style={[styles.resultCard, isDark && styles.darkCard]}>
                <View style={styles.resultHeader}>
                  <Text style={[styles.word, isDark && styles.lightText]}>
                    {result.पद}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => copyToClipboard(result.पद, 'word')}>
                      <Ionicons name="copy-outline" size={24} color={isDark ? '#fff' : '#555'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => speak(result.पद)}>
                      <Ionicons name="volume-high" size={24} color={isDark ? '#fff' : '#555'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleFavorite(result.पद)}>
                      <Ionicons name={favorites.includes(result.पद) ? 'heart' : 'heart-outline'} size={24} color={favorites.includes(result.पद) ? 'red' : (isDark ? '#aaa' : '#555')} />
                    </TouchableOpacity>
                  </View>
                </View>

                {result.लिंग && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.label, isDark && styles.lightText]}>Gender:</Text>
                    <Text style={[styles.value, isDark && styles.lightText]}>{result.लिंग}</Text>
                  </View>
                )}

                {result.व्याख्या && (
                  <View style={styles.detailRow}>
                    <View style={styles.meaningHeader}>
                      <Text style={[styles.label, isDark && styles.lightText]}>Meaning:</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(result.व्याख्या, 'meaning')} style={styles.copyButton}>
                        <Ionicons name="copy-outline" size={20} color={isDark ? '#fff' : '#555'} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.value, isDark && styles.lightText]}>{result.व्याख्या}</Text>
                  </View>
                )}

                {result.सन्दर्भ && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.label, isDark && styles.lightText]}>Reference:</Text>
                    <Text style={[styles.value, isDark && styles.lightText]}>{result.सन्दर्भ}</Text>
                  </View>
                )}

                {result.मराठी_अर्थ && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.label, isDark && styles.lightText]}>Marathi:</Text>
                    <Text style={[styles.value, isDark && styles.lightText]}>{result.मराठी_अर्थ}</Text>
                  </View>
                )}
              </View>
            ))}

            {/* Bottom Pagination */}
            {totalPages > 1 && (
              <View style={[styles.bottomPagination, isDark && styles.darkPagination]}>
                <TouchableOpacity onPress={goToPrevPage} disabled={currentPage === 1} style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}>
                  <Ionicons name="chevron-back" size={24} color={currentPage === 1 ? '#ccc' : (isDark ? '#fff' : '#00796b')} />
                </TouchableOpacity>
                <Text style={[styles.pageText, isDark && styles.lightText]}>
                  Page {currentPage} of {totalPages}
                </Text>
                <TouchableOpacity onPress={goToNextPage} disabled={currentPage === totalPages} style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}>
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
  resultsHeaderOnly: {
    marginBottom: 15,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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