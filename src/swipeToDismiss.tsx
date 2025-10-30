import { PropsWithChildren, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { RESET_THRESHOLD, DISMISS_THRESHOLD } from './swipeToDismiss.consts';
import { TrashIcon } from './assets/svg/TrashIconSvg';
import { SwipeToDismissProps } from './swipeToDismiss.types';
import { usePanGesture } from './usePanGesture.hooks';

export const SwipeToDismiss = (props: PropsWithChildren<SwipeToDismissProps>) => {
  const {
    children,
    onRemove,
    resetThresholdArg = RESET_THRESHOLD,
    dismissThresholdArg = DISMISS_THRESHOLD,
    dismissContainerCustomStyles,
  } = props;
  const [loaded, setLoaded] = useState(false);
  const {
    panGesture,
    translateDismissButtonX,
    itemHeight,
    itemWidth,
    itemOpacity,
    currentTranslateX,
  } = usePanGesture({ onRemove, resetThresholdArg, dismissThresholdArg });

  const animateCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: currentTranslateX.value }],
  }));

  const animateDismissButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateDismissButtonX.value }],
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

  const onTrashButtonPress = () => {
    itemOpacity.value = withTiming(0, { easing: Easing.out(Easing.ease) }, (finished: boolean) => {
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
        <Animated.View
          style={[
            styles.dismissButtonContainer,
            dismissContainerCustomStyles,
            animateDismissButtonStyle,
          ]}
        >
          <Pressable onPress={onTrashButtonPress} style={styles.trashIcon}>
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
  dismissButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#c70032',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  trashIcon: {
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
