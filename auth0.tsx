import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import config from './auth0-configuration';
import axios from 'axios';
import { useState } from 'react';

const Home = () => {
  const { authorize, clearSession, user, getCredentials, error, isLoading } = useAuth0();
  const baseUrl: string = 'https://8a5wtbnhv9.execute-api.us-east-1.amazonaws.com/test/ed/v1/';
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const loggedIn = user !== undefined && user !== null;

  const onLogin = async () => {
    try {
      await authorize({ audience: "https://experiencia-digital/", scope: "create:transaction" }, {}); 
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  const showCredentials = async () => {
    if (loggedIn) {
      const creds = await getCredentials();

      if (creds?.accessToken) {
        console.log('AccessToken obtained:', creds.accessToken);
        setAuthToken(creds.accessToken);
      } else {
        console.log('Error en login: ', creds);
      }
      
      if (creds?.accessToken) {
        console.log('Credentials: ', creds);
        console.log('authToken: ', authToken);
      }
      else {
        console.log('No tiene nada todavía');
      }
    }
  };

  const onLogout = async () => {
    await clearSession({}, {});
    setTransactionId(null);
  };

  const log = () => {
    console.log('xd');
  }

  const createTransaction = async () => {
    if (loggedIn && authToken !== '') {
      try {
        const response = await axios.post(
          `${baseUrl}transactions`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log('Response: ', response.data);
        if (response.data.transaction_id) {
          setTransactionId(response.data.transaction_id);
        }
      } catch (error) {
        console.error('Error making POST request: ', error);
      }
    }
  };

  const confirmTransaction = async () => {
    await authorize({audience: "https://experiencia-digital/", scope: "confirm:transaction"}, {});

    if (loggedIn && transactionId) {
      const creds = await getCredentials();
      const accessToken = creds?.accessToken;

      if (accessToken) {
        try {
          const response = await axios.post(
            `${baseUrl}transactions/${transactionId}/confirmation`,
            {}, 
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log('Response: ', response.data);
        } catch (error) {
          console.error('Error making POST request: ', error);
        }
      } else {
        console.log('No access token available');
      }
    } else {
      console.log('No transaction ID available');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Auth0Sample - Login </Text>
      {user && <Text>You are logged in as {user.name}</Text>}
      {!user && <Text>You are not logged in</Text>}
      <Pressable
        onPress={loggedIn ? onLogout : onLogin}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginVertical: 10,
          },
        ]}
      >
        <Text style={{ color: 'blue', fontSize: 16 }}>
          {loggedIn ? 'Log Out' : 'Log In'}
        </Text>
      </Pressable>

      <Pressable
        onPress={log}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginVertical: 10,
          },
        ]}
      >
        <Text style={{ color: 'blue', fontSize: 16 }}>
          Test Log
        </Text>
      </Pressable>

      {loggedIn && (
        <Pressable
          onPress={showCredentials}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
              marginVertical: 10,
            },
          ]}
        >
          <Text style={{ color: 'blue', fontSize: 16 }}>Show Access Token</Text>
        </Pressable>
      )}

      {loggedIn && (
        <Pressable
          onPress={createTransaction}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
              marginVertical: 10,
            },
          ]}
        >
          <Text style={{ color: 'blue', fontSize: 16 }}>Create transaction</Text>
        </Pressable>
      )}

      {loggedIn && (
        <Pressable
          onPress={confirmTransaction}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
              marginVertical: 10,
            },
          ]}
        >
          <Text style={{ color: 'blue', fontSize: 16 }}>Confirm transaction</Text>
        </Pressable>
      )}

      {error && <Text style={styles.error}>{error.message}</Text>}
    </View>
  );
};

const App = () => {
  return (
    <Auth0Provider domain={config.domain} clientId={config.clientId}>
      <Home />
    </Auth0Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  error: {
    margin: 20,
    textAlign: 'center',
    color: '#D8000C',
  },
});

export default App;
