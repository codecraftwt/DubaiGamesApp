import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { API_BASE_URL } from '../utils/Api';
import { useSelector } from 'react-redux';
// import { Search, X } from 'lucide-react-native';

export default function DynamicDropdown({ onSelect, placeholder = 'Search...', searchType, value }) {
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);

    const searchInput = useRef(null);
    const token = useSelector((state) => state.auth.token);


    useEffect(() => {
        setQuery(value || ''); // Update query when value prop changes
    }, [value]);

    const fetchResults = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const endpoint = searchType === 'code'
                ? `${API_BASE_URL}/agent/auto-code/${encodeURIComponent(searchQuery)}`
                : `${API_BASE_URL}/agent/auto/${encodeURIComponent(searchQuery)}`;


            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("API Response:", response.data);
            setResults(response.data);
            setShowDropdown(true);
        } catch (err) {
            setError('Failed to fetch results. Please try again.');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetch = useCallback(
        debounce((text) => fetchResults(text), 300),
        []
    );

    const handleInputChange = (text) => {
        setQuery(text);
        debouncedFetch(text);
    };

    const handleSelect = (item) => {
        setQuery(item);
        setShowDropdown(false);
        onSelect(item);
        searchInput.current?.blur();
    };
    const clearInput = () => {
        setQuery('');
        setResults([]);
        setShowDropdown(false);
        searchInput.current?.focus();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleSelect(item)}
        >
            <Text style={styles.dropdownItemText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                {/* <Search size={20} color="#666" style={styles.searchIcon} /> */}
                <TextInput
                    ref={searchInput}
                    style={styles.input}
                    value={query}
                    onChangeText={handleInputChange}
                    placeholder={placeholder}
                    placeholderTextColor="#666"
                    onFocus={() => query && setShowDropdown(true)}
                />
                {query ? (
                    <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
                        {/* <X size={20} color="#666" /> */}
                    </TouchableOpacity>
                ) : null}
            </View>

            {showDropdown && (
                <View style={styles.dropdownContainer}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#0066cc" />
                        </View>
                    ) : error ? (
                        <View style={styles.messageContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : results.length > 0 ? (
                        <FlatList
                            data={results}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.agentcode || item.name}
                            style={styles.dropdown}
                            keyboardShouldPersistTaps="handled"
                        />
                    ) : (
                        <View style={styles.messageContainer}>
                            <Text style={styles.noDataText}>No data found</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
        zIndex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        padding: 4,
    },
    dropdownContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        maxHeight: Math.min(Dimensions.get('window').height * 0.4, 300),
    },
    dropdown: {
        width: '100%',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    messageContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noDataText: {
        color: '#666',
        fontSize: 16,
    },
    errorText: {
        color: '#dc3545',
        fontSize: 16,
    },
});
