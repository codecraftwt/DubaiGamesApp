import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    PermissionsAndroid,
    // SafeAreaView
} from 'react-native';
import { useSelector } from 'react-redux';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api, { API_BASE_URL } from '../../utils/Api';

const BASE_URL = API_BASE_URL.replace('/api', '');

const VartharListScreen = () => {
    const token = useSelector((state) => state.auth.token);
    const [vartahars, setVartahars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        const fetchVartahars = async () => {
            try {
                const response = await api.get('/vartahars', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    setVartahars(response.data.data);
                } else {
                    throw new Error("Failed to fetch Varthar list.");
                }
            } catch (err) {
                console.error("Varthar fetch error:", err);
                Alert.alert("Error", "Failed to fetch Varthar list. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchVartahars();
    }, [token]);

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 29) {
                return true;
            }
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'This app needs access to your storage to download PDFs.',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const handleDownloadPdf = async (item) => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Storage permission is required to download the file.');
            return;
        }

        setDownloadingId(item.id);
        const pdfUrl = `${BASE_URL}${item.pdf_path}`;
        const fileName = pdfUrl.split('/').pop() || `varthar_${item.id}.pdf`;
        const { dirs } = ReactNativeBlobUtil.fs;
        const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
        const filePath = `${dirToSave}/${fileName}`;

        const config = {
            fileCache: true,
            path: filePath,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: filePath,
                description: 'Downloading PDF file.',
                title: fileName,
                mime: 'application/pdf',
                mediaScannable: true,
            },
        };

        ReactNativeBlobUtil.config(config)
            .fetch('GET', pdfUrl)
            .then((res) => {
                FileViewer.open(res.path(), { showOpenWithDialog: true })
                    .catch(error => {
                        console.error('FileViewer error:', error);
                        Alert.alert('Error', 'Could not open the PDF file. Please check your downloads folder.');
                    });
            })
            .catch((errorMessage) => {
                console.error(errorMessage);
                Alert.alert('Download Failed', 'An error occurred while downloading the file.');
            })
            .finally(() => {
                setDownloadingId(null);
            });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleDownloadPdf(item)} disabled={downloadingId !== null}>
            <Icon name="file-pdf-box" size={30} color="#D32F2F" />
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{`Varthar - ${new Date(item.created_at).toLocaleDateString()}`}</Text>
                <Text style={styles.cardSubtitle}>{item.pdf_path.split('/').pop()}</Text>
            </View>
            {downloadingId === item.id ? (
                <ActivityIndicator color="#007AFF" />
            ) : (
                <Icon name="download-circle-outline" size={24} color="#007AFF" />
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>            <FlatList
            data={vartahars}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No Varthahars found.</Text>}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    cardTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
});

export default VartharListScreen;