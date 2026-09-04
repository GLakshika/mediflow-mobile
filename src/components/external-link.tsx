import type { ReactNode } from 'react';
import { Linking, Pressable, type PressableProps, Text } from 'react-native';

type Props = Omit<PressableProps, 'children'> & {
  href: string;
  children?: ReactNode;
};

export function ExternalLink({ href, children, ...rest }: Props) {
  const content =
    typeof children === 'string' || typeof children === 'number' ? (
      <Text>{children}</Text>
    ) : (
      children
    );

  return (
    <Pressable
      accessibilityRole="link"
      {...rest}
      onPress={async () => {
        await Linking.openURL(href);
      }}
    >
      {content}
    </Pressable>
  );
}
