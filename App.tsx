import React, { Component, useState } from 'react';
import {
    AppRegistry,
    Button,
    Platform,
    StyleSheet,
    View,
    NativeModules,
    NativeEventEmitter,
    TextInput,
    Text
} from 'react-native';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter']);

const { JumioMobileSDK } = NativeModules;

let DATACENTER: string = 'DATACENTER';

// Tipar las funciones que utilizan NativeModules
const startJumio = (authorizationToken: string): void => {
    JumioMobileSDK.initialize(authorizationToken, DATACENTER);
    JumioMobileSDK.start();
};

const isDeviceRooted = async (): Promise<void> => {
    const isRooted: boolean = await JumioMobileSDK.isRooted();
    console.warn("Device is rooted: " + isRooted);
}

// Tipar la estructura de los eventos
interface EventResultType {
    [key: string]: any;
}

interface EventErrorType {
    [key: string]: any;
}

// Callbacks
const emitterJumio = new NativeEventEmitter(JumioMobileSDK);
emitterJumio.addListener(
    'EventResult',
    (EventResult: EventResultType) => console.warn("EventResult: " + JSON.stringify(EventResult))
);
emitterJumio.addListener(
    'EventError',
    (EventError: EventErrorType) => console.warn("EventError: " + JSON.stringify(EventError))
);

const AuthTokenInput: React.FC = () => {
    const [authorizationToken, setAuthorizationToken] = useState<string>("");
    const [buttonText, setButtonText] = useState<string>('Click');

    function handleClick(): void {
        setButtonText(DATACENTER);
    }

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="Authorization token"
                placeholderTextColor="#000"
                returnKeyType="done"
                onChangeText={text => setAuthorizationToken(text)}
                value={authorizationToken}
            />
            <Button
                title="Start"
                onPress={() => startJumio(authorizationToken)}
            />
            <View style={{ marginTop: 10 }}>
                <Button
                    title="US"
                    onPress={() => {
                        DATACENTER = "US";
                        handleClick();
                    }}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <Button
                    title="EU"
                    onPress={() => {
                        DATACENTER = "EU";
                        handleClick();
                    }}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <Button
                    title="SG"
                    onPress={() => {
                        DATACENTER = "SG";
                        handleClick();
                    }}
                />
            </View>
            <View style={styles.datacenter}>
                <Text>{buttonText}</Text>
            </View>
        </View>
    );
};

export default class DemoApp extends Component {
    render() {
        return (
            <View style={styles.container}>
                <AuthTokenInput />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    datacenterButton: {
        padding: 10,
    },
    datacenter: {
        marginTop: 10,
        alignItems: 'center',
    },
});

AppRegistry.registerComponent('DemoApp', () => DemoApp);
