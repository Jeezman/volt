/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Text, View, useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, CommonActions} from '@react-navigation/native';

import {PlainButton, LongBottomButton} from '../../components/button';
import {TextSingleInput} from '../../components/input';
import {DeletionAlert} from '../../components/alert';

import {useTailwind} from 'tailwind-rn';

import Color from '../../constants/Color';

import Back from '../../assets/svg/arrow-left-24.svg';
import Right from './../../assets/svg/chevron-right-24.svg';

import {AppStorageContext} from '../../class/storageContext';
import {WalletTypeNames} from '../../modules/wallet-utils';

const Info = () => {
    const tailwind = useTailwind();
    const ColorScheme = Color(useColorScheme());
    const navigation = useNavigation();

    // Get advanced mode flag, current wallet ID and wallet data
    const {
        isAdvancedMode,
        currentWalletID,
        getWalletData,
        renameWallet,
        deleteWallet,
    } = useContext(AppStorageContext);

    const walletData = getWalletData(currentWalletID);

    const HeadingBar = {
        height: 2,
        backgroundColor: ColorScheme.HeadingBar,
    };

    const capitalize = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const walletName = walletData.name;
    const walletPath = walletData.derivationPath;
    const walletType = WalletTypeNames[walletData.type];
    const walletNetwork = capitalize(walletData.network);
    const walletTypeName =
        walletType[0] + (isAdvancedMode ? ` (${walletType[1]})` : '');
    const walletFingerprint = walletData.masterFingerprint
        ? walletData.masterFingerprint.toUpperCase()
        : '-';
    const walletDescriptor = walletData.descriptor
        ? walletData.descriptor
        : '-';

    const [tmpName, setTmpName] = useState(walletName);

    const showDialog = () => {
        DeletionAlert(
            'Delete Wallet',
            'Are you sure you want to delete this wallet?',
            'Delete',
            handleDeleteWallet,
        );
    };

    const handleDeleteWallet = () => {
        try {
            // Navigate to HomeScreen
            // Make it clear deleted wallet is no longer in store
            navigation.dispatch(CommonActions.navigate({name: 'HomeScreen'}));

            // Delete wallet from store
            deleteWallet(currentWalletID);
        } catch (e) {
            console.error('[Wallet Screen] Error deleting wallet: ', e);
        }
    };

    return (
        <SafeAreaView>
            {/* Display Wallet Info, addresses, and other related data / settings */}
            <View style={[tailwind('w-full h-full items-center relative')]}>
                <View
                    style={[
                        tailwind(
                            'flex-row mt-6 w-5/6 justify-center items-center',
                        ),
                    ]}>
                    <PlainButton
                        style={[
                            tailwind(
                                'absolute w-full left-0 items-center flex-row',
                            ),
                        ]}
                        onPress={() => {
                            navigation.dispatch(CommonActions.goBack());
                        }}>
                        <Back fill={ColorScheme.SVG.Default} />
                    </PlainButton>
                    {/* Wallet name */}
                    <Text
                        style={[
                            tailwind('font-bold'),
                            {color: ColorScheme.Text.Default},
                        ]}>
                        Wallet Information
                    </Text>
                </View>

                {/* Allow user to change wallet name */}
                <PlainButton style={[tailwind('w-5/6 mt-12')]}>
                    <View>
                        <Text
                            style={[
                                tailwind('text-sm text-left mb-2'),
                                {color: ColorScheme.Text.Default},
                            ]}>
                            Name
                        </Text>
                        <View
                            style={[
                                tailwind('border-gray-400 px-4 w-full'),
                                {borderWidth: 1, borderRadius: 4},
                            ]}>
                            <TextSingleInput
                                placeholderTextColor={
                                    ColorScheme.Text.GrayedText
                                }
                                shavedHeight={true}
                                placeholder={walletName}
                                onChangeText={setTmpName}
                                onBlur={() => {
                                    renameWallet(currentWalletID, tmpName);
                                }}
                                color={ColorScheme.Text.Default}
                            />
                        </View>
                    </View>
                </PlainButton>

                {/* View Divider */}
                <View style={[tailwind('w-full my-8'), HeadingBar]} />

                {/* Wallet Info */}
                {/* Wallet Type Path and Master Fingerprint */}
                <View style={[tailwind('w-5/6 flex-row justify-start')]}>
                    <View style={[tailwind('w-1/2')]}>
                        <Text
                            style={[
                                tailwind('text-sm mr-16 mb-2'),
                                {color: ColorScheme.Text.GrayedText},
                            ]}>
                            Derivation Path
                        </Text>

                        <PlainButton>
                            <Text
                                style={[
                                    tailwind('text-sm'),
                                    {color: ColorScheme.Text.Default},
                                ]}>
                                {walletPath}
                            </Text>
                        </PlainButton>
                    </View>

                    <View style={[tailwind('w-1/2')]}>
                        <Text
                            style={[
                                tailwind('text-sm mb-2'),
                                {color: ColorScheme.Text.GrayedText},
                            ]}>
                            Master Fingerprint
                        </Text>

                        <PlainButton>
                            <Text
                                style={[
                                    tailwind('text-sm'),
                                    {color: ColorScheme.Text.Default},
                                ]}>
                                {walletFingerprint}
                            </Text>
                        </PlainButton>
                    </View>
                </View>

                {/* Wallet Network and Type */}
                <View style={[tailwind('w-5/6 mt-6 flex-row justify-start')]}>
                    <View style={[tailwind('w-1/2')]}>
                        <Text
                            style={[
                                tailwind('text-sm mb-2'),
                                {color: ColorScheme.Text.GrayedText},
                            ]}>
                            Network
                        </Text>

                        <PlainButton>
                            <Text
                                style={[
                                    tailwind('text-sm'),
                                    {color: ColorScheme.Text.Default},
                                ]}>
                                {walletNetwork}
                            </Text>
                        </PlainButton>
                    </View>

                    <View style={[tailwind('w-1/2')]}>
                        <Text
                            style={[
                                tailwind('text-sm mr-16 mb-2'),
                                {color: ColorScheme.Text.GrayedText},
                            ]}>
                            Type
                        </Text>

                        <PlainButton>
                            <Text
                                style={[
                                    tailwind('text-sm'),
                                    {color: ColorScheme.Text.Default},
                                ]}>
                                {walletTypeName}
                            </Text>
                        </PlainButton>
                    </View>
                </View>

                {/* Wallet Descriptor */}
                <View style={[tailwind('w-5/6 mt-6')]}>
                    <Text
                        style={[
                            tailwind('text-sm mb-2'),
                            {color: ColorScheme.Text.GrayedText},
                        ]}>
                        Descriptor
                    </Text>

                    {/* TODO: Allow to be copied to clipboard */}
                    <PlainButton>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            style={[
                                tailwind('text-sm'),
                                {color: ColorScheme.Text.Default},
                            ]}>
                            {walletDescriptor}
                        </Text>
                    </PlainButton>
                </View>

                {/* View Divider */}
                <View style={[tailwind('w-full my-8'), HeadingBar]} />

                {/* Wallet Tools */}
                {/* Backup / Export material - Seed and Descriptor */}
                <PlainButton
                    style={[tailwind('w-5/6 mb-6')]}
                    onPress={() => {
                        navigation.dispatch(
                            CommonActions.navigate({
                                name: 'WalletBackup',
                            }),
                        );
                    }}>
                    <View
                        style={[
                            tailwind('items-center flex-row justify-between'),
                        ]}>
                        <Text
                            style={[
                                tailwind('text-sm'),
                                {color: ColorScheme.Text.Default},
                            ]}>
                            Backup
                        </Text>

                        <View style={[tailwind('items-center')]}>
                            <Right
                                width={16}
                                stroke={ColorScheme.SVG.GrayFill}
                                fill={ColorScheme.SVG.GrayFill}
                            />
                        </View>
                    </View>
                </PlainButton>

                {/* Address Ownership Checker */}
                <PlainButton
                    style={[tailwind('w-5/6')]}
                    onPress={() => {
                        navigation.dispatch(
                            CommonActions.navigate({
                                name: 'AddressOwnership',
                            }),
                        );
                    }}>
                    <View
                        style={[
                            tailwind('items-center flex-row justify-between'),
                        ]}>
                        <Text
                            style={[
                                tailwind('text-sm'),
                                {color: ColorScheme.Text.Default},
                            ]}>
                            Check Address Ownership
                        </Text>

                        <View style={[tailwind('items-center')]}>
                            <Right
                                width={16}
                                stroke={ColorScheme.SVG.GrayFill}
                                fill={ColorScheme.SVG.GrayFill}
                            />
                        </View>
                    </View>
                </PlainButton>

                {/* Delete Wallet btn */}
                <LongBottomButton
                    title="Delete"
                    onPress={showDialog}
                    textColor={ColorScheme.Text.Alert}
                    backgroundColor={ColorScheme.Background.Alert}
                    style={[tailwind('font-bold')]}
                />
            </View>
        </SafeAreaView>
    );
};

export default Info;
