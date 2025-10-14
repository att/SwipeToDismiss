import { PropsWithChildren, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { DELETE_BUTTON_THRESHOLD, DISMISS_TRANSLATION_BREAKPOINT } from './swipeToDismiss.consts';
import { usePanGesture } from './usePanGesture.hooks';
import { TrashIcon } from './assets/svg/TrashIconSvg';
import { SwipeToDismissProps } from './swipeToDismiss.types';


export const SwipeToDismiss = (props: PropsWithChildren<SwipeToDismissProps>) => {
  const {
    children,
    onRemove,
    dismissThresholdArg = DISMISS_TRANSLATION_BREAKPOINT,
    deleteButtonThresholdArg = DELETE_BUTTON_THRESHOLD,
    deleteContainerCustomStyles,
  } = props;
  const [loaded, setLoaded] = useState(false);

  const { panGesture, translateDeleteButtonX, itemHeight, itemWidth, itemOpacity, currentTranslateX, backgroundColor } = usePanGesture(
    onRemove,
    dismissThresholdArg,
    deleteButtonThresholdArg,
  );

  const animateCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: currentTranslateX.value }],
  }));

  const animateDeleteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateDeleteButtonX.value }],
    backgroundColor: backgroundColor.value,
  }));

  const animateItemHeight = useAnimatedStyle(() => ({
    height: itemHeight.value,
    opacity: itemOpacity.value,
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    if (!loaded) {
      itemHeight.value = e.nativeEvent.layout.height;
      itemWidth.value = e.nativeEvent.layout.width;
      runOnJS(setLoaded)(true);
    }
  };

  const onDeleteButtonPress = () => {
    itemOpacity.value = withTiming(0, { easing: Easing.out(Easing.ease) }, finished => {
      itemHeight.value = withTiming(0, { easing: Easing.out(Easing.ease) }, () => {
        if (finished) {
          runOnJS(onRemove)();
        }
      });
    });
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={loaded ? animateItemHeight : { height: 'auto' }}>
        <Animated.View style={[styles.deleteButtonContainer, deleteContainerCustomStyles, animateDeleteButtonStyle]}>
          <Pressable onPress={onDeleteButtonPress} style={styles.deleteIcon}>
            {TrashIcon(styles.trashFill.color)}
          </Pressable>
        </Animated.View>
        <Animated.View style={animateCardStyle} onLayout={handleLayout}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  deleteButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'c70032',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '20%',
  },
  trashFill: {
    color: 'white',
  },
});
