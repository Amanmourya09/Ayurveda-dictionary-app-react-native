import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import API from '../utils/api';

const hindiAlphabets = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ',
  'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ',
  'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न',
  'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'
];

interface DictionaryEntry {
  Word: string;
}

export default function GlossaryScreen() {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState<DictionaryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 10;

  useEffect(() => {
    if (selectedLetter) {
      setCurrentPage(1); // Reset to first page when letter changes
      fetchWordsStartingWith(selectedLetter);
    }
  }, [selectedLetter]);

  const fetchWordsStartingWith = async (letter: string) => {
    setLoading(true);
    try {
      const response = await API.get('/index.php', {
        params: {
          Word: letter,
          limit: 60000
        }
      });

      if (response.data.status === 'success') {
        const allWords = response.data.data || [];
        const filteredWords = allWords.filter(entry =>
          entry.Word && entry.Word.startsWith(letter)
        );
        setWords(filteredWords);
      } else {
        setWords([]);
      }
    } catch (err) {
      console.error('Failed to fetch glossary words:', err);
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  const onWordPress = (word: string) => {
    router.push({
      pathname: '/results',
      params: { word, filter: 'Word' }
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(words.length / wordsPerPage);
  const indexOfLastWord = currentPage * wordsPerPage;
  const indexOfFirstWord = indexOfLastWord - wordsPerPage;
  const currentWords = words.slice(indexOfFirstWord, indexOfLastWord);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📖 हिन्दी वर्णमाला</Text>

      <View style={styles.grid}>
        {hindiAlphabets.map((char, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.button,
              selectedLetter === char && styles.selectedButton
            ]}
            onPress={() => setSelectedLetter(char)}
          >
            <Text
              style={[
                styles.letter,
                selectedLetter === char && styles.selectedLetter
              ]}
            >
              {char}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedLetter && (
        <>
          <Text style={styles.subtitle}>
            Words starting with "{selectedLetter}"
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#00796b" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.wordList}>
              {currentWords.length > 0 ? (
                <>
                  {currentWords.map((entry, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => onWordPress(entry.Word)}
                      style={[
                        styles.wordItem,
                        { backgroundColor: index % 2 === 0 ? '#ffffff' : '#e0e0e0' } // Alternate color
                      ]}
                    >
                      <Text style={styles.wordText}>{entry.Word}</Text>
                    </TouchableOpacity>
                  ))}


                  {/* Pagination Controls */}
                  <View style={styles.pagination}>
                    <TouchableOpacity
                      onPress={prevPage}
                      disabled={currentPage === 1}
                      style={[
                        styles.pageButton,
                        currentPage === 1 && styles.disabledButton
                      ]}
                    >
                      <Text style={styles.pageButtonText}>Previous</Text>
                    </TouchableOpacity>

                    <Text style={styles.pageInfo}>
                      {indexOfFirstWord + 1}-{Math.min(indexOfLastWord, words.length)} of {words.length}
                    </Text>

                    <TouchableOpacity
                      onPress={nextPage}
                      disabled={currentPage === totalPages}
                      style={[
                        styles.pageButton,
                        currentPage === totalPages && styles.disabledButton
                      ]}
                    >
                      <Text style={styles.pageButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.noResults}>
                  {loading ? 'Loading...' : `No words found starting with "${selectedLetter}"`}
                </Text>
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
    color: '#333'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    margin: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#00796b'
  },
  letter: {
    fontSize: 20,
    color: '#00796b',
    fontWeight: 'bold',
  },
  selectedLetter: {
    color: '#fff'
  },
  wordList: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  wordItem: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
    width: '90%',
  },
  wordText: {
    fontSize: 18,
    color: '#333',
  },
  noResults: {
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  pageButton: {
    backgroundColor: '#00796b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 16,
    color: '#555',
  },
});