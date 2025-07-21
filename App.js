import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, Text, Dimensions, ScrollView, Platform, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [text, setText] = useState('');
  const [mainPaths, setMainPaths] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  const handleInputBoxTouchEnd = () => {
    if (currentPath) {
      setMainPaths([...mainPaths, currentPath]);
      setCurrentPath('');
    }
    setIsDrawing(false);
  };

  const handleInputBoxTouchMove = (e) => {
    if (!isDrawing) return;
    const { locationX, locationY } = e.nativeEvent;
    setCurrentPath((prev) => prev + `${prev ? ' L' : 'M'}${locationX},${locationY}`);
  };

  const handleInputBoxTouchStart = (e) => {
    setIsDrawing(true);
    const { locationX, locationY } = e.nativeEvent;
    setCurrentPath(`M${locationX},${locationY}`);
  };

  const handleClearDrawing = () => {
    setMainPaths([]);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} style={{flex:1}}>
        <Text style={styles.title}>Notes App Prototype</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type your note here..."
          multiline
          value={text}
          onChangeText={setText}
        />
        <View style={styles.sheet}>
          <Text style={styles.sheetLabel}>Sheet (Text + Drawing)</Text>
          <Text style={styles.sheetText}>{text}</Text>
          <Svg height={200} width={width - 40} style={styles.svgSheet}>
            {mainPaths.map((d, i) => (
              <Path key={i} d={d} stroke="blue" strokeWidth={2} fill="none" />
            ))}
          </Svg>
        </View>
        <View style={{height:150}} />
      </ScrollView>
      
      <View style={styles.inputBoxContainerAbsolute} pointerEvents="box-none">
      
        <Text style={styles.inputBoxLabel}>Draw here (writes to sheet above)</Text>
        <View>
         <TouchableOpacity style={styles.clearButton} onPress={handleClearDrawing}>
          <Text style={styles.clearButtonText}>Clear Drawing</Text>
        </TouchableOpacity>
      </View>
        <View
          style={styles.inputBox}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleInputBoxTouchStart}
          onResponderMove={handleInputBoxTouchMove}
          onResponderRelease={handleInputBoxTouchEnd}
        >
          <Svg height={100} width={width - 40}>
            {currentPath ? <Path d={currentPath} stroke="black" strokeWidth={2} fill="none" /> : null}
          </Svg>
        </View>
       
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 0,
    minHeight: height,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: width - 40,
    minHeight: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sheet: {
    width: width - 40,
    minHeight: 220,
    borderColor: '#aaa',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    padding: 10,
  },
  sheetLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sheetText: {
    marginBottom: 8,
    color: '#333',
  },
  svgSheet: {
    backgroundColor: 'transparent',
  },
  inputBoxContainerAbsolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  inputBoxLabel: {
    fontSize: 14,
    marginBottom: 2,
    color: '#555',
  },
  inputBox: {
    width: width - 40,
    height: 100,
    borderColor: '#007AFF',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#eef6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  clearButton: {
    marginTop: 8,
    backgroundColor: '#ff5252',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
