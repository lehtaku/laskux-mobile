import React, {useState, useEffect, useCallback} from 'react';

import {StyleSheet, View} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {fetchAccountDetails} from '../../services/store/actions/account/fetchAccountDetails';
import {createOffer, createOfferResetState} from '../../services/store/actions/offers/createOffer';
import Translations from '../../services/localization/Translations';

import {getParsedOffer} from '../../utilities/parsers';

import {OFFER_FORM_INITIAL} from '../../constants/States/FormStates';
import {FORM_TYPES} from '../../constants/Types/FormTypes';
import RequestStates from '../../constants/States/RequestStates';
import {successAnimation} from '../../constants/Animations';

import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';
import OfferForm from '../../components/Forms/OfferForm';

export default function CreateOfferScreen({navigation}) {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const createOfferState = useSelector((store) => store.createOffer);

  const successToast = useSelector((store) => store.showToast.successToast);

  const [offerFormData, setOfferFormData] = useState(OFFER_FORM_INITIAL);

  const loadData = useCallback(() => {
    dispatch(fetchAccountDetails(account.token));
  }, [dispatch, account.token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  useEffect(() => {
    if (createOfferState.state === RequestStates.SUCCESS) {
      successToast.show(Translations.CREATE_OFFER_SUCCESS, successAnimation);
      dispatch(createOfferResetState());
      return navigation.navigate({name: 'Offers'});
    }
  }, [createOfferState.state, dispatch, successToast, navigation]);

  const dispatchCreateOffer = () => {
    const data = {
      ...getParsedOffer(offerFormData),
    };
    dispatch(createOffer(account.token, data));
  };

  const onLeave = () => {
    dispatch(createOfferResetState());
    navigation.goBack();
  };

  const isLoading = () => {
    return createOfferState.state === RequestStates.LOADING;
  };

  return (
    <View style={styles.container}>
      {isLoading() && <FloatingLoading />}
      <OfferForm
        formData={offerFormData}
        onChange={setOfferFormData}
        state={createOfferState.state}
        error={createOfferState.error}
        onSave={dispatchCreateOffer}
        onLeave={onLeave}
        formType={FORM_TYPES.CREATE}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
