// src/screens/portfolio/PortfolioScreen.js
import { View, Text, StyleSheet } from 'react-native';

const PortfolioScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Portfolio Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PortfolioScreen;