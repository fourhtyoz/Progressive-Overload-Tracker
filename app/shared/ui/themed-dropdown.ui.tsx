import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import { Text, XStack } from 'tamagui';

import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, globalStyles } from '@/app/shared/theme/global-styles';

type ThemedDropdownProps<T> = {
    data: T[];
    onSelect: (item: T, index: number) => void;
    defaultValue?: T;
    disabled?: boolean;
    renderItem: (item: T, index: number, isSelected: boolean) => React.ReactNode;
    renderButton: (selectedItem: T | undefined) => React.ReactNode;
    showsVerticalScrollIndicator?: boolean;
};

export function ThemedDropdown<T>({
    data,
    onSelect,
    defaultValue,
    disabled,
    renderItem,
    renderButton,
    showsVerticalScrollIndicator = false,
}: ThemedDropdownProps<T>) {
    const isDark = settingsStore.isDark;
    return (
        <SelectDropdown
            data={data as object[]}
            defaultValue={defaultValue as object}
            onSelect={(selectedItem, index) => onSelect(selectedItem as T, index)}
            disabled={disabled}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            dropdownStyle={{
                backgroundColor: isDark ? COLORS.darkDarkGrey : COLORS.dropdownBackground,
                borderRadius: 8,
                width: 'auto' as const,
            }}
            renderButton={(selectedItem) => renderButton(selectedItem as T | undefined)}
            renderItem={(item, index, isSelected) =>
                renderItem(item as T, index, isSelected)
            }
        />
    );
}

// Shared styled components for dropdown content

export function DropdownInput({ children }: { children: React.ReactNode }) {
    const isDark = settingsStore.isDark;
    return (
        <XStack
            borderWidth={1}
            borderColor={isDark ? COLORS.orange : COLORS.gray}
            borderRadius={8}
            padding={12}
        >
            {children}
        </XStack>
    );
}

export function DropdownText({ children }: { children: React.ReactNode }) {
    return (
        <Text fontSize={16} color="$color">
            {children}
        </Text>
    );
}

export function DropdownPlaceholder({ children }: { children: React.ReactNode }) {
    return (
        <Text fontSize={16} color="$colorMuted">
            {children}
        </Text>
    );
}

export function DropdownItem({
    isSelected,
    children,
    width,
}: {
    isSelected: boolean;
    children: React.ReactNode;
    width?: number;
}) {
    const isDark = settingsStore.isDark;
    return (
        <XStack
            style={[
                globalStyles.dropdownItemStyle,
                width ? { width } : undefined,
                isSelected && {
                    backgroundColor: isDark ? COLORS.darkGrey : COLORS.selectedLight,
                },
            ]}
        >
            {children}
        </XStack>
    );
}

export function DropdownItemText({ children }: { children: React.ReactNode }) {
    const isDark = settingsStore.isDark;
    return (
        <Text
            style={[
                globalStyles.dropdownItemTxtStyle,
                { color: isDark ? COLORS.textDarkScreen : COLORS.dropdownText },
            ]}
        >
            {children}
        </Text>
    );
}
