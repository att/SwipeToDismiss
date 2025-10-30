import { Gesture } from 'react-native-gesture-handler';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import { UsePanGestureProps } from './swipeToDismiss.types';

export const usePanGesture = ({
  onRemove,
  resetThresholdArg,
  dismissThresholdArg,
}: UsePanGestureProps) => {
  const initialTranslateX = useSharedValue(0);
  const currentTranslateX = useSharedValue(0);
  const translateDismissButtonX = useSharedValue(0);
  const itemHeight = useSharedValue(0);
  const itemWidth = useSharedValue(0);
  const dismissButtonThreshold = useSharedValue(0);
  const efficientOutApp = Easing.bezier(0.2, 0.1, 0.0, 1.0);

  const handleOnStart = () => {
    console.log("start")
    initialTranslateX.value = currentTranslateX.value;
    console.log(itemWidth.value);
    dismissButtonThreshold.value = -itemWidth.value * dismissThresholdArg;
  };

  const handleOnUpdate = (event: any) => {
    const isSwipingLeft = event.translationX + initialTranslateX.value <= 0;
    if (isSwipingLeft) {
      currentTranslateX.value = event.translationX + initialTranslateX.value;
    }
  };

  const resetPosition = () => {
    currentTranslateX.value = withTiming(0, { easing: Easing.inOut(Easing.ease) });
  };

  const snapToDismissButton = (dismissButtonThreshold: number) => {
    currentTranslateX.value = withTiming(dismissButtonThreshold, {
      easing: Easing.inOut(Easing.ease),
    });
    initialTranslateX.value = dismissButtonThreshold;
  };

  const dismissItem = () => {
    currentTranslateX.value = withTiming(-itemWidth.value, { easing: efficientOutApp }, () => {
      translateDismissButtonX.value = withTiming(
        -itemWidth.value,
        { easing: efficientOutApp },
        () => {
          itemHeight.value = withTiming(0, { easing: efficientOutApp }, (finished: boolean) => {
            if (finished) {
              runOnJS(onRemove)();
            }
          });
        }
      );
    });
  };

  const handleOnEnd = (event: any) => {
    const currentTranslateXValue = event.translationX + initialTranslateX.value;
    const dismissThreshold = -itemWidth.value * resetThresholdArg;
    if (currentTranslateXValue > dismissButtonThreshold.value / 2) {
      resetPosition();
    } else if (currentTranslateXValue > dismissThreshold) {
      snapToDismissButton(dismissButtonThreshold.value);
    } else {
      dismissItem();
    }
  };

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .withTestId('swipeOrDismiss')
    .activeOffsetX([-10, 10]) // Prevent activation on minor horizontal movements
    .activeOffsetY([-20, 20]) // Ignore the swipe gesture if there's vertical movement
    .onStart(handleOnStart)
    .onUpdate(handleOnUpdate)
    .onEnd(handleOnEnd);
  return {
    panGesture,
    translateDismissButtonX,
    itemHeight,
    itemWidth,
    itemOpacity: useSharedValue(1),
    currentTranslateX,
  };
};
