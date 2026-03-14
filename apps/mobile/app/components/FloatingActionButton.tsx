import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../theme/useAppTheme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export function FloatingActionButton({
  onPress,
  icon = 'plus',
}: FloatingActionButtonProps) {
  const { colors } = useAppTheme();
  const shadowOffset = useSharedValue(6);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: 6 - shadowOffset.value },
      { translateY: 6 - shadowOffset.value },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Hard Shadow */}
      <View style={[styles.shadow, { backgroundColor: colors.border }]} />
      
      <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor: colors.primary,
              borderColor: colors.border,
            },
          ]}
          onPress={onPress}
          onPressIn={() => {
            shadowOffset.value = withSpring(0, { damping: 20, stiffness: 300 });
          }}
          onPressOut={() => {
            shadowOffset.value = withSpring(6, { damping: 20, stiffness: 300 });
          }}
          activeOpacity={1}
          accessibilityLabel="Create expense"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons 
            name={icon} 
            size={32} 
            color={colors.background} 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
  },
  fab: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: 4,
  },
  shadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 64,
    height: 64,
    borderRadius: 4,
  },
  animatedWrapper: {
    width: 64,
    height: 64,
  },
});
