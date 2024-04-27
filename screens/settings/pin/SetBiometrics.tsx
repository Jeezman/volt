/* eslint-disable react-native/no-inline-styles */
import {Text, View, useColorScheme} from 'react-native';
import React, {useContext} from 'react';

import {useTailwind} from 'tailwind-rn';
import Color from '../../../constants/Color';

import {useNavigation} from '@react-navigation/native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {CommonActions} from '@react-navigation/native';

import {capitalizeFirst} from '../../../modules/transform';

import {LongButton, PlainButton} from '../../../components/button';
import {useTranslation} from 'react-i18next';

import BitcoinAstro from './../../../assets/svg/bitcoin-astro.svg';
import Success from './../../../assets/svg/check-circle-fill-24.svg';
import NativeWindowMetrics from '../../../constants/NativeWindowMetrics';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SettingsParamList} from '../../../Navigation';
import {AppStorageContext} from '../../../class/storageContext';

type Props = NativeStackScreenProps<SettingsParamList, 'SetBiometrics'>;

import RNBiometrics from '../../../modules/biometrics';
import {BiometryTypes} from 'react-native-biometrics';
import {toastConfig} from '../../../components/toast';
import Toast, {ToastConfig} from 'react-native-toast-message';

const SetBiometrics = ({route}: Props) => {
    const navigation = useNavigation();
    const tailwind = useTailwind();
    const ColorScheme = Color(useColorScheme());

    const {t} = useTranslation('settings');

    const {setBiometricsActive} = useContext(AppStorageContext);
    const [doneSetup, setDoneSetup] = React.useState<boolean>(false);

    const handleRoute = () => {
        navigation.dispatch(
            CommonActions.navigate('SettingsRoot', {screen: 'Wallet'}),
        );
    };

    const handleBiometrics = async () => {
        try {
            const {available, biometryType, error} =
                await RNBiometrics.isSensorAvailable();

            if (error) {
                Toast.show({
                    topOffset: 54,
                    type: 'Liberal',
                    text1: t('Biometrics'),
                    text2: t('biometrics_error'),
                    visibilityTime: 1750,
                });
                return;
            }

            if (available) {
                if (biometryType === BiometryTypes.FaceID) {
                    RNBiometrics.simplePrompt({
                        promptMessage: 'Confirm FaceID',
                    })
                        .then(({success}) => {
                            if (success) {
                                setBiometricsActive(true);
                                setDoneSetup(true);
                            }
                        })
                        .catch((err: any) => {
                            Toast.show({
                                topOffset: 54,
                                type: 'Liberal',
                                text1: t('Biometrics'),
                                text2: err.message,
                                visibilityTime: 1750,
                            });
                        });
                } else if (
                    available &&
                    biometryType === BiometryTypes.Biometrics
                ) {
                    RNBiometrics.simplePrompt({
                        promptMessage: 'Confirm Biometrics',
                    })
                        .then(({success}) => {
                            if (success) {
                                setBiometricsActive(true);
                                handleRoute();
                            }
                        })
                        .catch((err: any) => {
                            Toast.show({
                                topOffset: 54,
                                type: 'Liberal',
                                text1: t('Biometrics'),
                                text2: err.message,
                                visibilityTime: 1750,
                            });
                        });
                } else {
                    Toast.show({
                        topOffset: 54,
                        type: 'Liberal',
                        text1: t('Biometrics'),
                        text2: error,
                        visibilityTime: 1750,
                    });
                }
            }
        } catch (err: any) {
            Toast.show({
                topOffset: 54,
                type: 'Liberal',
                text1: t('Biometrics'),
                text2: err.message,
                visibilityTime: 1750,
            });
        }
    };

    const handleDone = () => {
        if (doneSetup) {
            handleRoute();
            return;
        }

        handleBiometrics();
    };

    const skipAlong = () => {
        if (route.params?.standalone) {
            navigation.dispatch(
                CommonActions.navigate('SettingsRoot', {screen: 'Wallet'}),
            );
        } else {
            navigation.dispatch(CommonActions.navigate({name: 'DonePIN'}));
        }
    };

    return (
        <SafeAreaView
            style={[
                {flex: 1, backgroundColor: ColorScheme.Background.Primary},
            ]}>
            <View style={[tailwind('w-full h-full items-center')]}>
                <View
                    style={[
                        tailwind('items-center h-full w-full justify-center'),
                    ]}>
                    <View
                        style={[
                            tailwind('items-center w-5/6'),
                            {marginTop: -64},
                        ]}>
                        {doneSetup ? (
                            <Success
                                fill={ColorScheme.SVG.Default}
                                width={200}
                                height={200}
                            />
                        ) : (
                            <BitcoinAstro height={256} width={256} />
                        )}

                        <Text
                            style={[
                                tailwind('text-xl font-bold text-white mb-2'),
                                {color: ColorScheme.Text.Default},
                            ]}>
                            {doneSetup
                                ? t('setup_bio_success')
                                : t('setup_bio')}
                        </Text>

                        <Text
                            style={[
                                tailwind('text-base text-center'),
                                {color: ColorScheme.Text.DescText},
                            ]}>
                            {doneSetup
                                ? t('setup_bio_done_desc')
                                : t('setup_bio_desc')}
                        </Text>
                    </View>

                    <View
                        style={[
                            tailwind('absolute w-5/6'),
                            {bottom: NativeWindowMetrics.bottomButtonOffset},
                        ]}>
                        {!doneSetup && (
                            <PlainButton onPress={skipAlong}>
                                <Text
                                    style={[
                                        tailwind(
                                            'text-base text-center font-bold mb-6',
                                        ),
                                        {color: ColorScheme.Text.DescText},
                                    ]}>
                                    {route.params?.standalone
                                        ? capitalizeFirst(t('cancel'))
                                        : capitalizeFirst(t('skip'))}
                                </Text>
                            </PlainButton>
                        )}
                        <LongButton
                            title={capitalizeFirst(
                                doneSetup ? t('done') : t('enable'),
                            )}
                            textColor={ColorScheme.Text.Alt}
                            backgroundColor={ColorScheme.Background.Inverted}
                            onPress={handleDone}
                        />
                    </View>
                </View>

                <Toast config={toastConfig as ToastConfig} />
            </View>
        </SafeAreaView>
    );
};

export default SetBiometrics;
