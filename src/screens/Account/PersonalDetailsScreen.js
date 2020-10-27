import React, {useCallback, useEffect, useState} from 'react';

import {Button} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {fetchPersonalDetails} from '../../services/store/actions/account/fetchPersonalDetails';
import {
  updatePersonalDetails,
  updatePersonalDetailsResetState,
} from '../../services/store/actions/account/updatePersonalDetails';
import {getFieldError} from '../../utilities/validations';
import Translations from '../../services/localization/Translations';

import {successAnimation} from '../../constants/Animations';
import RequestStates from '../../constants/States/RequestStates';

import FloatingLoading from '../../components/Indicators/FloatingLoading';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import PlainTextInput from '../../components/Inputs/PlainTextInput';
import PasswordInput from '../../components/Inputs/PasswordInput';
import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';
import BottomSafeAreaContainer from '../../components/Layout/BottomSafeAreaContainer';
import Colors from '../../constants/Colors';

export default function PersonalDetailsScreen({navigation}) {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const fetchPersonalDetailsState = useSelector((store) => store.fetchPersonalDetails);
  const updatePersonalDetailsState = useSelector((store) => store.updatePersonalDetails);

  const successToast = useSelector((store) => store.showToast.successToast);

  const [formData, setFormData] = useState({
    email: null,
    name: null,
    password: null,
    password_confirmation: null,
  });

  const loadData = useCallback(() => {
    dispatch(fetchPersonalDetails(account.token));
  }, [account.token, dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (fetchPersonalDetailsState.state === RequestStates.SUCCESS) {
      const details = fetchPersonalDetailsState.details;
      setFormData((data) => ({
        ...data,
        email: details.email,
        name: details.name,
      }));
    }
  }, [fetchPersonalDetailsState.details, fetchPersonalDetailsState.state]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(updatePersonalDetailsResetState());
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (updatePersonalDetailsState.state === RequestStates.SUCCESS) {
      successToast.show(Translations.SAVE_DETAILS_SUCCESS, successAnimation);
      return navigation.goBack();
    }
  }, [updatePersonalDetailsState.state, navigation, successToast]);

  const emitChanges = (newData) => {
    setFormData((data) => ({...data, ...newData}));
  };

  const dispatchUpdateDetails = () => {
    dispatch(updatePersonalDetails(account.token, formData));
  };

  const isLoading = () => {
    return updatePersonalDetailsState.state === RequestStates.LOADING;
  };

  const renderContent = () => {
    switch (fetchPersonalDetailsState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_DETAILS} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            onPressButton={loadData}
            message={Translations.LOADING_DETAILS_FAILED}
          />
        );
      case RequestStates.SUCCESS:
        return (
          <BottomSafeAreaContainer>
            {isLoading() && <FloatingLoading />}
            <KeyboardAwareScroll>
              <PlainTextInput
                label={Translations.EMAIL}
                value={formData.email}
                topBorder
                disabled
              />
              <PlainTextInput
                label={Translations.NAME}
                value={formData.name}
                onEdit={(value) => emitChanges({name: value})}
                error={getFieldError(updatePersonalDetailsState.error, 'name')}
              />
              <PasswordInput
                label={Translations.PASSWORD}
                value={formData.password}
                onEdit={(value) => emitChanges({password: value})}
                error={getFieldError(updatePersonalDetailsState.error, 'password')}
              />
              <PasswordInput
                label={Translations.CONFIRM_PASSWORD}
                value={formData.password_confirmation}
                onEdit={(value) => emitChanges({password_confirmation: value})}
                error={getFieldError(updatePersonalDetailsState.error, 'password_confirmation')}
              />
            </KeyboardAwareScroll>
            <View style={styles.bottomContainer}>
              <Button
                onPress={dispatchUpdateDetails}
                title={Translations.SAVE}
                containerStyle={styles.saveButtonContainer}
                buttonStyle={styles.saveButton}
              />
            </View>
          </BottomSafeAreaContainer>
        );
      default:
        return null;
    }
  };

  return renderContent();
}

const styles = StyleSheet.create({
  saveButtonContainer: {
    marginVertical: 16,
    marginHorizontal: 12,
  },
  bottomContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'solid',
  },
  saveButton: {
    paddingVertical: 12,
  },
});
