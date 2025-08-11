import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HindiKeyboard from '../../components/HindiKeyboard';

export default function HomeScreen() {
  const [word, setWord] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showHindiKeyboard, setShowHindiKeyboard] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!word.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://inputtools.google.com/request?itc=hi-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test&text=${word}`
        );
        const data = await res.json();
        if (data[0] === 'SUCCESS') {
          setSuggestions(data[1][0][1]);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Suggestion fetch error:', err);
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [word]);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('searchHistory');
      if (stored) setHistory(JSON.parse(stored));
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveToHistory = async (term: string) => {
    try {
      const updated = [term, ...history.filter(item => item !== term)].slice(0, 5);
      setHistory(updated);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const handleSearch = () => {
    if (!word.trim()) return;
    saveToHistory(word.trim());
    router.push({
      pathname: '/results',
      params: {
        word: word.trim(),
        filter: selectedFilter || 'Word'
      }
    });
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilter(prev => prev === filter ? '' : filter);
  };

  const handleKeyPress = (char: string) => {
    setWord(prev => prev + char);
  };

  const handleBackspace = () => {
    setWord(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setWord(prev => prev + ' ');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={{ flex: 1, position: 'relative' }}>
          <ScrollView
            contentContainerStyle={styles.centeredContent}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />

            <Text style={styles.title}> आयुर्वेद-शब्दार्थबोधिका</Text>

            <View style={styles.searchRow}>
              <TextInput
                style={styles.input}
                placeholder="Search Sanskrit words..."
                placeholderTextColor="#999"
                value={word}
                onChangeText={setWord}
                onFocus={() => setShowHindiKeyboard(false)}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />

              {word ? (
                <TouchableOpacity onPress={() => setWord('')}>
                  <Ionicons name="close-circle" size={24} color="#999" />
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => setShowHindiKeyboard(prev => !prev)}
                style={{ marginLeft: 10 }}
              >
                <Entypo name="keyboard" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.searchButtonText}>Search</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Hindi Suggestions */}
            {suggestions.length > 0 && (
              <View style={{ backgroundColor: '#fff', borderRadius: 6, elevation: 2, marginTop: 5 }}>
                {suggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      setWord(item);
                      saveToHistory(item);
                      router.push({
                        pathname: '/results',
                        params: { word: item, filter: selectedFilter },
                      });
                    }}
                  >
                    <Ionicons name="search" size={18} color="#555" style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Filters */}
            <View style={styles.filtersContainer}>
              <Text style={styles.filterTitle}>Filters:</Text>
              <View style={styles.filterButtons}>
                {['Word', 'Description', 'Reference', 'Book'].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterButton,
                      selectedFilter === filter && styles.activeFilter,
                    ]}
                    onPress={() => toggleFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedFilter === filter && styles.activeFilterText,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Searches */}
            {history.length > 0 && !word && (
              <View style={styles.historyContainer}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.historyList}>
                  {history.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.historyItem}
                      onPress={() => {
                        setWord(item);
                        handleSearch();
                      }}
                    >
                      <Text style={styles.historyText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {showHindiKeyboard && (
            <HindiKeyboard
              onKeyPress={handleKeyPress}
              onBackspace={handleBackspace}
              onSpace={handleSpace}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 26,
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredContent: {
    flexGrow: 1,
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
    color: '#2d3436',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filtersContainer: {
    marginBottom: 15,
    marginTop: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    color: '#00796b',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  historyContainer: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  historyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  historyItem: {
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  historyText: {
    color: '#00796b',
  },
});
