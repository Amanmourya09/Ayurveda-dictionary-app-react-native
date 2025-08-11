import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Props {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
}

const vowels = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'];
const matras = ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', 'ँ', '्', 'ॠ'];
const consonantsRow1 = ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ञ'];
const consonantsRow2 = ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'];
const consonantsRow3 = ['प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व'];
const consonantsRow4 = ['श', 'ष', 'स', 'ह', 'ळ', 'क्ष', 'त्र', 'ज्ञ'];

export default function HindiKeyboard({ onKeyPress, onBackspace, onSpace }: Props) {
  const renderRow = (chars: string[]) => (
    <View style={styles.row}>
      {chars.map((char) => (
        <TouchableOpacity
          key={char}
          style={styles.key}
          onPress={() => onKeyPress(char)}
        >
          <Text style={styles.keyText}>{char}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.keyboardContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {renderRow(vowels)}
          {renderRow(matras)}
          {renderRow(consonantsRow1)}
          {renderRow(consonantsRow2)}
          {renderRow(consonantsRow3)}
          {renderRow(consonantsRow4)}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.key, styles.actionKey]} onPress={onSpace}>
              <Text style={styles.keyText}>Space</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.key, styles.actionKey]} onPress={onBackspace}>
              <Text style={styles.keyText}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 4,
  },
  key: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 2,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  keyText: {
    fontSize: 16,
    color: '#000',
  },
  actionKey: {
    backgroundColor: '#ddd',
    paddingHorizontal: 20,
  },
});
