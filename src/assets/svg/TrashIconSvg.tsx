import { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

export const trashIconSvg = (fill: string): string => `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" fill="black" fill-opacity="0.01" style="mix-blend-mode:multiply"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.75 3.75H16.2525L15 0.75H9L7.7475 3.75H2.25V5.25H4.5V21C4.5 22.2426 5.50736 23.25 6.75 23.25H17.25C18.4926 23.25 19.5 22.2426 19.5 21V5.25H21.75V3.75ZM9.9975 2.25H14.0025L14.625 3.75H9.375L9.9975 2.25ZM18 21C18 21.4142 17.6642 21.75 17.25 21.75H6.75C6.33579 21.75 6 21.4142 6 21V5.25H18V21ZM10.5 18H9V9H10.5V18ZM15 18H13.5V9H15V18Z" fill=${fill}/>
</svg>
`;

export const TrashIcon = (fill: string, customStyle?: StyleProp<ViewStyle>, accessabilityLabel?: string): ReactElement<string, string> => {
  return <SvgXml style={[{ height: 24, width: 24 }, customStyle]} xml={trashIconSvg(fill)} fill={fill} testID='trashIcon_testID' accessibilityLabel={accessabilityLabel} />;
};