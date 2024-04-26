/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';

import {StyleSheet, View, useColorScheme} from 'react-native';
import VText from '../../components/text';

import {CommonActions} from '@react-navigation/native';

import {useNavigation} from '@react-navigation/core';

import {SafeAreaView} from 'react-native-safe-area-context';

import RNHapticFeedback from 'react-native-haptic-feedback';

import {RNHapticFeedbackOptions} from '../../constants/Haptic';

import Checkbox from 'react-native-bouncy-checkbox';

import {useTailwind} from 'tailwind-rn';

import {useTranslation} from 'react-i18next';

import {PlainButton} from '../../components/button';

import Back from './../../assets/svg/arrow-left-24.svg';

import {AppStorageContext} from '../../class/storageContext';

import Font from '../../constants/Font';
import Color from '../../constants/Color';

import {capitalizeFirst} from '../../modules/transform';
import {setKeychainItem} from '../../class/keychainContext';

import RNBiometrics from '../../modules/biometrics';

const Wallet = () => {
    const navigation = useNavigation();

    const ColorScheme = Color(useColorScheme());

    const tailwind = useTailwind();

    const {t, i18n} = useTranslation('settings');
    const langDir = i18n.dir() === 'rtl' ? 'right' : 'left';

    const HeadingBar = {
        height: 2,
        backgroundColor: ColorScheme.HeadingBar,
    };

    const {
        isAdvancedMode,
        setIsAdvancedMode,
        hideTotalBalance,
        setTotalBalanceHidden,
        isPINActive,
        setPINActive,
        isBiometricsActive,
        setBiometricsActive,
    } = useContext(AppStorageContext);

    const requestBiometrics = async () => {
        const {available} = await RNBiometrics.isSensorAvailable();

        if (!available) {
            return;
        }

        RNBiometrics.simplePrompt({
            promptMessage: 'Confirm fingerprint',
        }).then(({success}) => {
            if (success) {
                setBiometricsActive(false);
                return;
            }
        });
    };

    const handleBiometrics = () => {
        if (isBiometricsActive) {
            requestBiometrics();
        }

        if (!isBiometricsActive) {
            RNHapticFeedback.trigger('rigid', RNHapticFeedbackOptions);

            navigation.dispatch(
                CommonActions.navigate({
                    name: 'SetBiometrics',
                    params: {
                        standalone: true,
                    },
                }),
            );
        }
    };

    const handleSetPIN = async () => {
        // TODO: request PIN before turning it off
        if (isPINActive) {
            setPINActive(!isPINActive);
            await setKeychainItem('pin', '');
        }

        // Otherwise, go through flow to setup pin in 'SetPIN' screen
        if (!isPINActive) {
            RNHapticFeedback.trigger('rigid', RNHapticFeedbackOptions);

            navigation.dispatch(
                CommonActions.navigate({
                    name: 'WelcomePIN',
                }),
            );
        }
    };

    return (
        <SafeAreaView>
            <View
                style={[
                    tailwind('w-full h-full'),
                    {backgroundColor: ColorScheme.Background.Primary},
                ]}>
                <View
                    style={[
                        tailwind('w-full h-full mt-4 items-center'),
                        styles.flexed,
                    ]}>
                    <View style={tailwind('w-5/6 mb-16')}>
                        <PlainButton
                            style={tailwind('items-center flex-row -ml-1')}
                            onPress={() => {
                                navigation.dispatch(CommonActions.goBack());
                            }}>
                            <Back
                                style={tailwind('mr-2')}
                                fill={ColorScheme.SVG.Default}
                            />
                            <VText
                                style={[
                                    tailwind('text-sm font-medium'),
                                    {color: ColorScheme.Text.Default},
                                    Font.RobotoText,
                                ]}>
                                {capitalizeFirst(t('settings'))}
                            </VText>
                        </PlainButton>
                    </View>

                    <View
                        style={tailwind('justify-center w-full items-center')}>
                        <VText
                            style={[
                                tailwind('text-2xl mb-4 w-5/6 font-medium'),
                                {color: ColorScheme.Text.Default},
                                Font.RobotoText,
                            ]}>
                            {capitalizeFirst(t('wallet'))}
                        </VText>

                        <View style={[tailwind('w-full'), HeadingBar]} />

                        {/* Toggle advanced mode */}
                        <View
                            style={tailwind(
                                'justify-center w-full items-center flex-row mt-8 mb-10',
                            )}>
                            <View style={tailwind('w-5/6')}>
                                <View
                                    style={tailwind(
                                        `w-full ${
                                            langDir === 'right'
                                                ? 'flex-row-reverse'
                                                : 'flex-row'
                                        } items-center mb-2`,
                                    )}>
                                    <VText
                                        style={[
                                            tailwind('text-sm font-medium'),
                                            {color: ColorScheme.Text.Default},
                                        ]}>
                                        {t('advanced_mode')}
                                    </VText>
                                    <Checkbox
                                        fillColor={
                                            ColorScheme.Background
                                                .CheckBoxFilled
                                        }
                                        unfillColor={
                                            ColorScheme.Background
                                                .CheckBoxUnfilled
                                        }
                                        size={18}
                                        isChecked={isAdvancedMode}
                                        iconStyle={{
                                            borderWidth: 1,
                                            borderRadius: 2,
                                        }}
                                        innerIconStyle={{
                                            borderWidth: 1,
                                            borderColor:
                                                ColorScheme.Background
                                                    .CheckBoxOutline,
                                            borderRadius: 2,
                                        }}
                                        style={[
                                            tailwind(
                                                'flex-row absolute -right-4',
                                            ),
                                        ]}
                                        onPress={() => {
                                            RNHapticFeedback.trigger(
                                                'rigid',
                                                RNHapticFeedbackOptions,
                                            );

                                            setIsAdvancedMode(!isAdvancedMode);
                                        }}
                                        disableBuiltInState={true}
                                    />
                                </View>

                                <View style={tailwind('w-full')}>
                                    <VText
                                        style={[
                                            tailwind('text-xs'),
                                            {color: ColorScheme.Text.DescText},
                                        ]}>
                                        {t('advanced_mode_description')}
                                    </VText>
                                </View>
                            </View>
                        </View>

                        {/* Hide wallet balance */}
                        <View style={tailwind('w-5/6')}>
                            <View
                                style={tailwind(
                                    `w-full ${
                                        langDir === 'right'
                                            ? 'flex-row-reverse'
                                            : 'flex-row'
                                    } items-center mb-2`,
                                )}>
                                <VText
                                    style={[
                                        tailwind('text-sm font-medium'),
                                        {color: ColorScheme.Text.Default},
                                    ]}>
                                    {t('hide_balance')}
                                </VText>
                                <Checkbox
                                    fillColor={
                                        ColorScheme.Background.CheckBoxFilled
                                    }
                                    unfillColor={
                                        ColorScheme.Background.CheckBoxUnfilled
                                    }
                                    size={18}
                                    isChecked={hideTotalBalance}
                                    iconStyle={{
                                        borderWidth: 1,
                                        borderRadius: 2,
                                    }}
                                    innerIconStyle={{
                                        borderWidth: 1,
                                        borderColor:
                                            ColorScheme.Background
                                                .CheckBoxOutline,
                                        borderRadius: 2,
                                    }}
                                    style={[
                                        tailwind('flex-row absolute -right-4'),
                                    ]}
                                    onPress={() => {
                                        RNHapticFeedback.trigger(
                                            'rigid',
                                            RNHapticFeedbackOptions,
                                        );

                                        setTotalBalanceHidden(
                                            !hideTotalBalance,
                                        );
                                    }}
                                    disableBuiltInState={true}
                                />
                            </View>

                            <VText
                                style={[
                                    tailwind('text-xs'),
                                    {color: ColorScheme.Text.DescText},
                                ]}>
                                {t('hide_balance_description')}
                            </VText>
                        </View>

                        {/* Toggle PIN mode */}
                        <View
                            style={tailwind(
                                'justify-center w-full items-center flex-row mt-8 mb-10',
                            )}>
                            <View style={tailwind('w-5/6')}>
                                <View
                                    style={tailwind(
                                        `w-full ${
                                            langDir === 'right'
                                                ? 'flex-row-reverse'
                                                : 'flex-row'
                                        } items-center mb-2`,
                                    )}>
                                    <VText
                                        style={[
                                            tailwind('text-sm font-medium'),
                                            {color: ColorScheme.Text.Default},
                                        ]}>
                                        {t('enable_pin_mode')}
                                    </VText>
                                    <Checkbox
                                        fillColor={
                                            ColorScheme.Background
                                                .CheckBoxFilled
                                        }
                                        unfillColor={
                                            ColorScheme.Background
                                                .CheckBoxUnfilled
                                        }
                                        size={18}
                                        isChecked={isPINActive}
                                        iconStyle={{
                                            borderWidth: 1,
                                            borderRadius: 2,
                                        }}
                                        innerIconStyle={{
                                            borderWidth: 1,
                                            borderColor:
                                                ColorScheme.Background
                                                    .CheckBoxOutline,
                                            borderRadius: 2,
                                        }}
                                        style={[
                                            tailwind(
                                                'flex-row absolute -right-4',
                                            ),
                                        ]}
                                        onPress={handleSetPIN}
                                        disableBuiltInState={true}
                                    />
                                </View>

                                <View style={tailwind('w-full')}>
                                    <VText
                                        style={[
                                            tailwind('text-xs'),
                                            {color: ColorScheme.Text.DescText},
                                        ]}>
                                        {t('enable_pin_mode_description')}
                                    </VText>
                                </View>
                            </View>
                        </View>

                        {/* Toggle Biometrics mode */}
                        {isPINActive && (
                            <View
                                style={tailwind(
                                    'justify-center w-full items-center flex-row mb-10',
                                )}>
                                <View style={tailwind('w-5/6')}>
                                    <View
                                        style={tailwind(
                                            `w-full ${
                                                langDir === 'right'
                                                    ? 'flex-row-reverse'
                                                    : 'flex-row'
                                            } items-center mb-2`,
                                        )}>
                                        <VText
                                            style={[
                                                tailwind('text-sm font-medium'),
                                                {
                                                    color: ColorScheme.Text
                                                        .Default,
                                                },
                                            ]}>
                                            {t('enable_biometrics_mode')}
                                        </VText>
                                        <Checkbox
                                            onPress={handleBiometrics}
                                            fillColor={
                                                ColorScheme.Background
                                                    .CheckBoxFilled
                                            }
                                            unfillColor={
                                                ColorScheme.Background
                                                    .CheckBoxUnfilled
                                            }
                                            size={18}
                                            isChecked={isBiometricsActive}
                                            iconStyle={{
                                                borderWidth: 1,
                                                borderRadius: 2,
                                            }}
                                            innerIconStyle={{
                                                borderWidth: 1,
                                                borderColor:
                                                    ColorScheme.Background
                                                        .CheckBoxOutline,
                                                borderRadius: 2,
                                            }}
                                            style={[
                                                tailwind(
                                                    'flex-row absolute -right-4',
                                                ),
                                            ]}
                                            disableBuiltInState={true}
                                        />
                                    </View>

                                    <View style={tailwind('w-full')}>
                                        <VText
                                            style={[
                                                tailwind('text-xs'),
                                                {
                                                    color: ColorScheme.Text
                                                        .DescText,
                                                },
                                            ]}>
                                            {t(
                                                'enable_biometrics_mode_description',
                                            )}
                                        </VText>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Wallet;

const styles = StyleSheet.create({
    flexed: {
        flex: 1,
    },
});
