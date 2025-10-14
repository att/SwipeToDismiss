import { useCallback } from 'react';
import { Gesture, GestureStateChangeEvent, GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';

export const usePanGesture = (onRemove: () => void, dismissThresholdArg: number, deleteButtonThresholdArg: number) => {
  const initialTranslateX = useSharedValue(0);
  const currentTranslateX = useSharedValue(0);
  const translateDeleteButtonX = useSharedValue(0);
  const itemHeight = useSharedValue(0);
  const itemWidth = useSharedValue(0);
  const deleteButtonThreshold = useSharedValue(0);
  const backgroundColor = useSharedValue('transparent');
  const efficientOutApp = Easing.bezier(0.2, 0.1, 0.0, 1.0);

  const handleOnStart = useCallback(() => {
    initialTranslateX.value = currentTranslateX.value;
    deleteButtonThreshold.value = -itemWidth.value * deleteButtonThresholdArg;
  }, [initialTranslateX, currentTranslateX]);

  const handleOnUpdate = useCallback(
    (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      const isSwipingLeft = event.translationX + initialTranslateX.value <= 0;

      if (isSwipingLeft) {
        currentTranslateX.value = event.translationX + initialTranslateX.value;
      }
    },
    [initialTranslateX, currentTranslateX],
  );

  const resetPosition = useCallback(() => {
    backgroundColor.value = 'transparent';
    currentTranslateX.value = withTiming(0, { easing: Easing.inOut(Easing.ease) });
  }, [currentTranslateX]);

  const snapToDeleteButton = useCallback(
    (deleteButtonThreshold: number) => {
      currentTranslateX.value = withTiming(deleteButtonThreshold, { easing: Easing.inOut(Easing.ease) });
      initialTranslateX.value = deleteButtonThreshold;
    },
    [currentTranslateX],
  );

  const dismissItem = useCallback(() => {
    currentTranslateX.value = withTiming(-itemWidth.value, { easing: efficientOutApp }, () => {
      translateDeleteButtonX.value = withTiming(-itemWidth.value, { easing: efficientOutApp }, () => {
        itemHeight.value = withTiming(0, { easing: efficientOutApp }, finished => {
          if (finished) {
            runOnJS(onRemove)();
          }
        });
      });
    });
  }, [itemWidth, currentTranslateX, translateDeleteButtonX, itemHeight, onRemove]);

  const handleOnEnd = useCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      const currentTranslateXValue = event.translationX + initialTranslateX.value;
      const dismissThreshold = -itemWidth.value * dismissThresholdArg;

      if (currentTranslateXValue > deleteButtonThreshold.value / 2) {
        resetPosition();
      } else if (currentTranslateXValue > dismissThreshold) {
        snapToDeleteButton(deleteButtonThreshold.value);
      } else {
        dismissItem();
      }
    },
    [initialTranslateX, itemWidth, resetPosition, snapToDeleteButton, dismissItem],
  );

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
    translateDeleteButtonX,
    itemHeight,
    itemWidth,
    itemOpacity: useSharedValue(1),
    currentTranslateX,
    backgroundColor,
  };
};
