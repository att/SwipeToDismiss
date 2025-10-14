import { StyleProp, ViewStyle } from 'react-native';

export interface SwipeToDismissProps {
  onRemove: () => void;
  dismissThresholdArg?: number;
  deleteButtonThresholdArg?: number;
  deleteContainerCustomStyles?: StyleProp<ViewStyle>;
}
