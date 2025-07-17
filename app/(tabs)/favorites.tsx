// favorites.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]);

  const loadFavorites = async () => {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  };

  const removeFromFavorites = async (word: string) => {
    const updatedFavorites = favorites.filter(item => item !== word);
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faff" />
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingTop: 10 }}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <Text style={styles.word}>{item}</Text>
              <TouchableOpacity onPress={() => removeFromFavorites(item)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    backgroundColor: '#f8faff',
  },
  favoriteItem: {
    padding: 12,
    backgroundColor: '#e0f7fa',
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  word: {
    fontSize: 16,
    color: '#333',
  },
  removeText: {
    color: 'tomato',
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default FavoritesScreen;
