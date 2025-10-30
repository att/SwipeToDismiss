# swipe-to-dismiss

A production-ready React Native component for swipe-to-dismiss cards with smooth animations, built with `react-native-gesture-handler` and `react-native-reanimated`.

[![npm version](https://badge.fury.io/js/swipe-to-dismiss.svg)](https://badge.fury.io/js/swipe-to-dismiss)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

* 🚀 Smooth native animations powered by Reanimated
* 👆 Swipe left to reveal delete action
* 🗑️ Tap delete button to dismiss items
* 🎨 Fully customizable styling and icons
* ♿ Accessible with screen reader support
* 📱 Works on iOS and Android

## Installation

```bash
npm install swipe-to-dismiss react-native-gesture-handler react-native-reanimated
# or
yarn add swipe-to-dismiss react-native-gesture-handler react-native-reanimated
```

### iOS Setup

```bash
cd ios && pod install
```

### Setup Required

⚠️ **Important**: Wrap your app with `GestureHandlerRootView` for gestures to work:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SwipeToDismiss } from 'swipe-to-dismiss';

const YourCardComponent = ({ label }) => (
  <View style={styles.card}>
    <Text>{label}</Text>
  </View>
);

export default function MyList() {
  const [items, setItems] = useState(['Item A', 'Item B', 'Item C']);

  const handleRemove = (itemToRemove) => {
    setItems(items => items.filter(item => item !== itemToRemove));
  };

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <SwipeToDismiss
          key={item}
          onRemove={() => handleRemove(item)}
        >
          <YourCardComponent label={item} />
        </SwipeToDismiss>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRemove` | `() => void` | **Required** | Called when the item is dismissed. |
| `children` | `ReactNode` | **Required** | Content rendered inside the swipeable area. |
| `dismissThresholdArg` | `number` | `0.4` | Swipe fraction (0-1) to auto-dismiss on release. |
| `resetThresholdArg` | `number` | `0.15` | Swipe fraction (0-1) to snap open the delete action. |
| `dismissContainerCustomStyles` | `StyleProp<ViewStyle>` | `undefined` | Style override for the delete action container. |

## Behavior

* **Swipe left** to reveal the delete button
* **Continue swiping** past the dismiss threshold to auto-dismiss
* **Tap the delete button** to dismiss immediately
* **Swipe right** or release early to reset position
* **Invalid thresholds** (outside 0-1 range) are automatically corrected with a warning

## Custom Thresholds

```tsx
<SwipeToDismiss
  onRemove={handleRemove}
  dismissThresholdArg={0.6} // Require 60% swipe to auto-dismiss
  resetThresholdArg={0.2} // Snap open delete action at 20%
>
  <YourCardComponent />
</SwipeToDismiss>
```

For more examples including undo functionality, confirmation dialogs, and testing, see [EXAMPLES.md](./EXAMPLES.md).

## Notes

- Thresholds are clamped between 0 and 1.

## Requirements

* React Native >= 0.60
* react-native-gesture-handler >= 2.0.0
* react-native-reanimated >= 3.0.0

## TypeScript

This package includes TypeScript definitions. All props are fully typed for the best developer experience.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/yourusername/swipe-to-dismiss/issues).
