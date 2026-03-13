import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from 'react';
import { isTimeExceeded } from '../../utils/marketTime';

const EntriesList = ({
  reversedGroupedEntries,
  Delete,
  handleEdit,
  handleChangeMsg,
  resultnum,
  resultpan,
  userRole,
  marketResults,
  marketTimes,
  currentTime,
  declaredResults,
  onSelectionChange,
  isLoading
}) => {
  const [selectedEntries, setSelectedEntries] = useState([]);


  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading entries...</Text>
      </View>
    );
  }

  if (!reversedGroupedEntries) return null;

  // Function to check if results are out for specific markets
  const isKalyanResultOut = marketResults?.some(result =>
    result.market === "Kalyan"
  );

  const isMumbaiResultOut = marketResults?.some(
    result => result.market === 'Mumbai',
  );

  // New helpers: detect open/close result declarations per market
  const isOpenResultDeclaredForMarket = (market) => {
    return marketResults?.some(r => r.market === market && (r.type === 'open-pan' || r.type === 'openpan'));
  };

  const isCloseResultDeclaredForMarket = (market) => {
    return marketResults?.some(r => r.market === market && (r.type === 'close-pan' || r.type === 'closepan'));
  };

  const openRestrictedTypes = new Set([
    'open',
    'jodi',
    'chokada',
    'cycle',
    'cut',
    'cut_open',
    'cut_close',
    'running_pan',
    'saral_pan',
    'ulta_pan',
    'beerich',
    'farak',
    'openpan',
  ]);

  const closeRestrictedTypes = new Set([
    'closepan',
    'close',
  ]);

  const getCategoryHeaderTheme = (rawType = '') => {
    const type = rawType.toLowerCase();

    if (type === 'open') return { backgroundColor: '#00d0ff', textColor: '#0f172a' };
    if (type === 'chokada') return { backgroundColor: '#ffc990', textColor: '#0f172a' };
    if (type === 'cycle') return { backgroundColor: '#8000ff', textColor: '#ffffff' };
    if (type === 'cut' || type === 'cut_open' || type === 'cut_close') {
      return { backgroundColor: '#ff0000', textColor: '#ffffff' };
    }
    if (type === 'running_pan') return { backgroundColor: '#fffb90', textColor: '#0f172a' };
    if (type === 'beerich') return { backgroundColor: '#0008fb', textColor: '#ffffff' };
    if (type === 'openpan' || type.startsWith('openpan_')) {
      return { backgroundColor: '#ffb6c1', textColor: '#0f172a' };
    }

    return { backgroundColor: 'transparent', textColor: '#333333' };
  };

  const shouldHideActions = (entry) => {
    const type = (entry?.type || '').toLowerCase();
    const market = entry?.market;
    const openDeclared = isOpenResultDeclaredForMarket(market);
    const closeDeclared = isCloseResultDeclaredForMarket(market);

    const isOpenRestricted = openRestrictedTypes.has(type) || type.startsWith('openpan');
    const isCloseRestricted = closeRestrictedTypes.has(type) || type.startsWith('closepan');

    // Check if results are declared (existing logic)
    if (openDeclared && isOpenRestricted) return true;
    if (closeDeclared && isCloseRestricted) return true;

    // Check if market time has exceeded
    if (marketTimes && currentTime) {
      const marketTimeData = marketTimes?.filter(
        time => time.market.toLowerCase() === market?.toLowerCase(),
      );

      if (marketTimeData && marketTimeData.length > 0) {
        // Check if open time has exceeded for open-related categories
        const openTimeExceeded = marketTimeData.some(
          time => time.type === 'open' && isTimeExceeded(time.end_time, currentTime),
        );

        // Check if close time has exceeded for close-related categories
        const closeTimeExceeded = marketTimeData.some(
          time => time.type === 'close' && isTimeExceeded(time.end_time, currentTime),
        );

        if (openTimeExceeded && isOpenRestricted) return true;
        if (closeTimeExceeded && isCloseRestricted) return true;
      }
    }

    return false;
  };

  const handleEntrySelection = entry => {
    const isSelected = selectedEntries.some(e => e.id === entry.id);
    let newSelectedEntries;

    if (isSelected) {
      newSelectedEntries = selectedEntries.filter(e => e.id !== entry.id);
    } else {
      newSelectedEntries = [...selectedEntries, entry];
    }

    setSelectedEntries(newSelectedEntries);
    onSelectionChange(newSelectedEntries);
  };

  const getMarketResultData = (marketName) => {
    const relevantResults = [...(declaredResults || []), ...(marketResults || [])].filter(
      r => r.market?.toLowerCase() === marketName?.toLowerCase()
    );

    let resultnum = null;
    let resultpan = null;
    let result_cl_num = null;
    let result_cl_pan = null;
    let openDeclared = false;
    let closeDeclared = false;

    relevantResults.forEach(item => {
      const type = (item.type || '').toLowerCase().replace('-', '');
      if (type === 'openpan' || type === 'open') {
        resultnum = item.number;
        resultpan = item.pannumber;
        openDeclared = true;
      }
      if (type === 'closepan' || type === 'close') {
        result_cl_num = item.number;
        result_cl_pan = item.pannumber;
        closeDeclared = true;
      }
    });

    return { resultnum, resultpan, result_cl_num, result_cl_pan, openDeclared, closeDeclared };
  };

  // Helper function to check if a number is a winning number (Legacy Logic)
  const isWinningNumberLegacy = (number, index, entryType, numbersArray, marketData) => {
    const { resultnum, resultpan, result_cl_num, result_cl_pan, openDeclared, closeDeclared } = marketData;
    const type = entryType.toLowerCase();

    if (type === 'running_pan') {
      if (closeDeclared) {
        // If Close declared: BOTH must match to highlight
        const num0 = numbersArray[0];
        const num1 = numbersArray[1];
        return (num0 == resultpan && num1 == result_cl_pan);
      } else if (openDeclared) {
        // If only Open declared: Highlight first part if matches
        if (index === 0) return number == resultpan;
      }
      return false;
    }

    if (type === 'cycle') {
      if (closeDeclared) {
        // If Close declared: BOTH must match
        const num0 = numbersArray[0]?.toString();
        const num1 = numbersArray[1]?.toString();
        return (num0?.includes(resultnum) && num1?.includes(result_cl_num));
      } else if (openDeclared) {
        if (index === 0) return number.toString().includes(resultnum);
      }
      return false;
    }

    if (type === 'jodi' || type === 'chokada') {
      if (closeDeclared) {
        // Match full result (Open+Close)
        const res = String(resultnum) + String(result_cl_num);
        return number == res;
      } else if (openDeclared) {
        // Match first digit with Open Result
        const firstChar = number.toString().charAt(0);
        return firstChar == resultnum;
      }
      return false;
    }

    // Default logic for other types
    if (type.includes('close') || type === 'cut_close') {
      if (!closeDeclared) return false;
      if (type.includes('pan')) return number == result_cl_pan;
      return number.toString().includes(result_cl_num);
    }

    if (type.includes('open') || type === 'cut_open' || type === 'cut' || type === 'beerich' || type === 'farak') {
      if (!openDeclared) return false;
      if (type.includes('pan')) return number == resultpan;
      return number.toString().includes(resultnum);
    }

    // Fallback for simple matches
    if (openDeclared && number == resultnum) return true;
    if (closeDeclared && number == result_cl_num) return true;

    return false;
  };

  const renderNumbers = (entry, type) => {
    if (!entry) return <Text style={styles.numbers}>N/A</Text>;
    const marketData = getMarketResultData(entry.market);

    try {
      let numbersArray = [];

      if (
        type === 'running_pan' ||
        type === 'beerich' ||
        type === 'farak' ||
        type === 'cycle' ||
        type === 'chokada'
      ) {
        numbersArray = JSON.parse(entry.entry_number);
      } else if (type === 'jodi') {
        numbersArray = JSON.parse(entry.number);
      } else if (
        type === 'openpan' ||
        type === 'openpan_dp' ||
        type === 'openpan_sp' ||
        type === 'openpan_tp'
      ) {
        numbersArray = JSON.parse(entry.entry_number);
      } else if (
        type === 'closepan' ||
        type === 'closepan_dp' ||
        type === 'closepan_sp' ||
        type === 'closepan_tp'
      ) {
        numbersArray = JSON.parse(entry.entry_number);
      } else {
        numbersArray = JSON.parse(entry.number);
      }

      return (
        <View style={styles.numbersContainer}>
          {numbersArray.map((num, index) => {
            const isWinning = isWinningNumberLegacy(num, index, type, numbersArray, marketData);
            return (
              <Text
                key={index}
                style={[
                  styles.numberText,
                  isWinning && styles.winningNumber
                ]}
              >
                {num}{index < numbersArray.length - 1 ? ', ' : ''}
              </Text>
            );
          })}
        </View>
      );
    } catch (e) {
      return <Text style={styles.numbers}>{entry.number || entry.entry_number || 'N/A'}</Text>;
    }
  };

  const renderNormalEntries = entries => {
    return entries.map((entry, index) => {
      const isResultOut =
        entry.market === 'Kalyan'
          ? isKalyanResultOut
          : entry.market === 'Mumbai'
            ? isMumbaiResultOut
            : false;

      const isSelected = selectedEntries.some(e => e.id === entry.id);

      const hideActions = shouldHideActions(entry);
      const headerTheme = getCategoryHeaderTheme(entry.type);

      return (
        <View
          key={`normal-${entry.id}-${index}`}
          style={[
            styles.cardStyle,
            { backgroundColor: entry.verified_by === 0 ? '#fff' : 'lightgreen' },
          ]}>
          <View style={[
            styles.cardHeader,
            { backgroundColor: headerTheme.backgroundColor }
          ]}>
            {/* <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleEntrySelection(entry)}> */}
            {/* <View style={{ alignContent: 'center' }}>
              {isSelected && <Icon name="check" size={12} color="#fff" />}
            </View> */}
            {/* </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => {
            }}> */}
            <Text style={[styles.cardType, { color: headerTheme.textColor }]}>
              {entry.type.toUpperCase()}
            </Text>
            {/* </TouchableOpacity> */}
          </View>
          <View style={styles.cardContent}>
            {renderNumbers(entry, entry.type)}
            <Text style={styles.amount}>₹ {entry.amount}</Text>
          </View>
          {entry.verified_by === 0 && !hideActions && (
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEdit(entry.id)}>
                <Icon name="edit" size={20} color="#0066FF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Delete(entry.id)}>
                <Icon name="trash" size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    });
  };

  const renderPanTableEntries = panEntries => {
    const childrenGrouped = {};
    const parents = {};

    panEntries.forEach(entry => {
      if (entry.type === 'saral_pan' || entry.type === 'ulta_pan') {
        if (entry.parent !== '0') {
          try {
            const parentIds = JSON.parse(entry.parent);
            const parentKey = JSON.stringify(parentIds);

            if (!childrenGrouped[parentKey]) {
              childrenGrouped[parentKey] = {
                children: [],
                type: entry.type,
                market: entry.market,
              };
            }
            childrenGrouped[parentKey].children.push(entry);
          } catch (e) {
            console.error('Error parsing parent IDs:', e);
          }
        } else {
          parents[entry.id] = entry;
        }
      }
    });

    return (
      <View style={styles.panContainer}>
        {Object.keys(childrenGrouped).map((parentKey, index) => {
          const parentIds = JSON.parse(parentKey);
          const type = childrenGrouped[parentKey].type;
          const market = childrenGrouped[parentKey].market;
          const children = childrenGrouped[parentKey].children;
          const marketData = getMarketResultData(market);
          const { resultnum, resultpan, result_cl_num, result_cl_pan } = marketData;

          const openDeclared = isOpenResultDeclaredForMarket(market);
          // saral_pan and ulta_pan are restricted on open result
          const hideActions = openDeclared;

          let parentContent = [];
          let childContent = [];
          let flag = 0;

          parentIds.forEach(parentId => {
            if (parents[parentId]) {
              const parent = parents[parentId];
              // Exact match logic for parents
              let isWinning = false;
              if (type === 'ulta_pan' && resultnum == parent.number) {
                isWinning = true;
                flag = 1;
              } else if (type === 'saral_pan' && resultpan == parent.number) {
                isWinning = true;
                flag = 1;
              }

              parentContent.push(
                <View key={`parent-${parentId}`} style={styles.panEntry}>
                  <Text
                    style={[
                      styles.normalText,
                      isWinning && styles.winningNumber
                    ]}>
                    {parent.number}X{parent.amount}
                  </Text>
                </View>,
              );
            }
          });

          children.forEach(child => {
            let isWinning = false;
            // Child match depends on parent match (flag)
            if (flag === 1) {
              if (type === 'ulta_pan' && result_cl_pan == child.number) {
                isWinning = true;
              } else if (type === 'saral_pan' && result_cl_num == child.number) {
                isWinning = true;
              }
            }

            childContent.push(
              <View key={`child-${child.id}`} style={styles.panEntry}>
                <Text style={[
                  styles.normalText,
                  isWinning && styles.winningNumber
                ]}>
                  {child.number}X{child.amount}
                </Text>
              </View>,
            );
          });

          const mergedIds = [...parentIds, ...children.map(child => child.id)];
          const backgroundColor =
            parents[parentIds[0]]?.verified_by === 0 ? '#fff' : 'lightgreen';

          return (
            <View
              key={`pan-${index}`}
              style={[styles.cardStyle, { backgroundColor }]}>
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  onPress={() => {
                    /* verify_status would go here */
                  }}>
                  <Text style={styles.cardType}>
                    {type.toUpperCase()} ({market})
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.panContent}>
                {parentContent}
                {childContent}
              </View>
              {parents[parentIds[0]]?.verified_by === 0 && !hideActions && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Delete(JSON.stringify(mergedIds))}>
                    <Icon name="trash" size={20} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderAllEntries = () => {
    const allEntries = [];
    Object.values(reversedGroupedEntries).forEach(group => {
      Object.values(group).forEach(entry => {
        if (typeof entry === 'object' && entry !== null && 'id' in entry) {
          allEntries.push(entry);
        }
      });
    });

    const normalEntries = allEntries.filter(
      entry => entry.type !== 'saral_pan' && entry.type !== 'ulta_pan',
    );

    const panEntries = allEntries.filter(
      entry => entry.type === 'saral_pan' || entry.type === 'ulta_pan',
    );

    return (
      <View style={styles.container}>
        {renderNormalEntries(normalEntries)}
        {renderPanTableEntries(panEntries)}
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>{renderAllEntries()}</ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000',
    width: '48%',
  },
  panCard: {
    width: '100%',
    marginBottom: 15,
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  numberText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  winningNumber: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  cardHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
    flex: 1,
    flexDirection: "row"
  },
  chokadaHeader: {
    backgroundColor: '#FFC990',
  },
  runningPanHeader: {
    backgroundColor: '#FFFB90',
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'center'
    // marginLeft: 20,
  },
  cardContent: {
    padding: 10,
  },
  panContent: {
    padding: 10,
  },
  panEntry: {
    marginBottom: 5,
  },
  numbers: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  normalText: {
    color: '#333',
  },
  amount: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    marginLeft: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#0066FF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#0066FF',
  },
  panContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default EntriesList;
