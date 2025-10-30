import { StyleProp, ViewStyle } from 'react-native';

export interface SwipeToDismissProps {
  onRemove: () => void;
  resetThresholdArg?: number;
  dismissThresholdArg?: number;
  dismissContainerCustomStyles?: StyleProp<ViewStyle>;
}
export interface UsePanGestureProps {
  onRemove: () => void;
  resetThresholdArg: number;
  dismissThresholdArg: number;
}
