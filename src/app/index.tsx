import {StatusBar} from 'expo-status-bar';
import { useState } from "react";

import {  
  Alert,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Equipo {
  id: number;
  nombre: string;
  tipo: string;
  ubicacion: string;
  ip: string;
  estado: string;
}

const TIPOS = ['ROUTER', 'SWITCH', 'SWITCH_POE', 'CONVERTIDOR_MEDIOS', 'PATCH_CORD_COBRE', 'PATCH_CORD_FIBRA'];

export default function Index() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [usuario, setUsuario] = useState<string | null>(null);
  const [rol, setRol] = useState('');
  const [pantalla, setPantalla] = useState<'lista' | 'agregar'>('lista');

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [ip, setIp] = useState('');

  // Login de demostración: valida dentro de la app, sin base de datos.
  function entrar() {
    if (username === 'admin' && password === 'admin123') {
      setUsuario('admin');
      setRol('ADMINISTRADOR');
      setPantalla('lista');
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  }

  function salir() {
    setUsuario(null);
    setPassword('');
    setPantalla('lista');
  }

  function guardarDispositivo() {
    const tipoMayus = tipo.trim().toUpperCase();

    if (!nombre.trim() || !tipoMayus) {
      Alert.alert('Faltan datos', 'Escribe al menos el nombre y el tipo.');
      return;
    }
    if (!TIPOS.includes(tipoMayus)) {
      Alert.alert('Tipo no válido', `Usa uno de estos: ${TIPOS.join(', ')}`);
      return;
    }

    const nuevo: Equipo = {
      id: Date.now(),
      nombre: nombre.trim(),
      tipo: tipoMayus,
      ubicacion: ubicacion.trim() || 'Sin ubicación',
      ip: ip.trim() || 'Sin IP',
      estado: 'ACTIVO',
    };

    setEquipos([...equipos, nuevo]);
    setNombre('');
    setTipo('');
    setUbicacion('');
    setIp('');
    Alert.alert('Listo', 'Dispositivo agregado.');
  }

  if (!usuario) {
    return (
      <View style={styles.login}>
        <Text style={styles.loginTitulo}>RedFibra</Text>
        <Text style={styles.subtitulo}>Gestión de red y fibra óptica</Text>

        <TextInput
          style={styles.campo}
          placeholder="Usuario"
          placeholderTextColor="#8a8a8a"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.campo}
          placeholder="Contraseña"
          placeholderTextColor="#8a8a8a"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.boton} onPress={entrar} activeOpacity={0.8}>
          <Text style={styles.botonTexto}>Entrar</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    );
  }

  if (pantalla === 'agregar') {
    return (
      <ScrollView contentContainerStyle={styles.formulario}>
        <Text style={styles.titulo}>Agregar dispositivo</Text>
        <Text style={styles.ayuda}>Tipos válidos: {TIPOS.join(', ')}</Text>

        <TextInput
          style={styles.campo}
          placeholder="Nombre (ej. Router principal)"
          placeholderTextColor="#8a8a8a"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.campo}
          placeholder="Tipo (ej. ROUTER)"
          placeholderTextColor="#8a8a8a"
          autoCapitalize="characters"
          value={tipo}
          onChangeText={setTipo}
        />
        <TextInput
          style={styles.campo}
          placeholder="Ubicación (ej. Cuarto de comunicaciones)"
          placeholderTextColor="#8a8a8a"
          value={ubicacion}
          onChangeText={setUbicacion}
        />
        <TextInput
          style={styles.campo}
          placeholder="IP (ej. 192.168.10.1)"
          placeholderTextColor="#8a8a8a"
          keyboardType="numbers-and-punctuation"
          value={ip}
          onChangeText={setIp}
        />

        <TouchableOpacity style={styles.boton} onPress={guardarDispositivo} activeOpacity={0.8}>
          <Text style={styles.botonTexto}>Guardar dispositivo</Text>
        </TouchableOpacity>

        <View style={styles.separador} />
        <Button title="Volver a la lista" onPress={() => setPantalla('lista')} />
        <StatusBar style="auto" />
      </ScrollView>
    );
  }

  return (
    <View style={styles.pantalla}>
      <View style={styles.barra}>
        <View>
          <Text style={styles.usuario}>
            {usuario} ({rol})
          </Text>
          <Button title="Agregar dispositivo" onPress={() => setPantalla('agregar')} />
        </View>
        <Button title="Salir" onPress={salir} />
      </View>

      <FlatList
        data={equipos}
        keyExtractor={(equipo) => String(equipo.id)}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay dispositivos. Toca "Agregar dispositivo".</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>Tipo: {item.tipo}</Text>
            <Text>Ubicación: {item.ubicacion}</Text>
            <Text>IP: {item.ip}</Text>
            <Text>Estado: {item.estado}</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#f4f6f8',
  },
  loginTitulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0d47a1',
  },
  subtitulo: {
    fontSize: 15,
    textAlign: 'center',
    color: '#616161',
    marginBottom: 32,
  },
  formulario: {
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#ffffff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  ayuda: {
    fontSize: 13,
    textAlign: 'center',
    color: '#616161',
    marginBottom: 20,
  },
  campo: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
  },
  boton: {
    backgroundColor: '#1565c0',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separador: {
    height: 16,
  },
  pantalla: {
    flex: 1,
    paddingTop: 48,
    backgroundColor: '#ffffff',
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  usuario: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tarjeta: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vacio: {
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
});