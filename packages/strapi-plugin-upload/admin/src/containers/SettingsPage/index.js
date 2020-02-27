import React, { useEffect, useReducer, useRef } from 'react';
import { Header, Inputs } from '@buffetjs/custom';
import { useIsMounted } from '@buffetjs/hooks';
import { isEqual } from 'lodash';
import {
  LoadingIndicatorPage,
  useGlobalContext,
  request,
} from 'strapi-helper-plugin';
import getRequestUrl from '../../utils/getRequestUrl';
import getTrad from '../../utils/getTrad';
import Text from '../../components/Text';
import Divider from './Divider';
import SectionTitleWrapper from './SectionTitleWrapper';
import Wrapper from './Wrapper';
import init from './init';
import reducer, { initialState } from './reducer';

const SettingsPage = () => {
  const { formatMessage } = useGlobalContext();
  const [reducerState, dispatch] = useReducer(reducer, initialState, init);
  const { initialData, isLoading, modifiedData } = reducerState.toJS();
  const isMounted = useIsMounted();
  const getDataRef = useRef();
  const abortController = new AbortController();

  getDataRef.current = async () => {
    try {
      const { signal } = abortController;
      const { data } = await request(
        getRequestUrl('settings', { method: 'GET', signal })
      );

      if (isMounted) {
        dispatch({
          type: 'GET_DATA_SUCCEEDED',
          data,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // TODO: uncomment when API ready
    // getDataRef.current();

    return () => {
      abortController.abort();
    };
  }, [abortController]);

  const handleSubmit = async () => {
    try {
      // TODO: uncomment when API ready
      // await request(getRequestUrl('settings'), {
      //   method: 'PUT',
      //   body: modifiedData,
      // });
      if (isMounted) {
        dispatch({
          type: 'SUBMIT_SUCCEEDED',
        });
      }

      strapi.notification.success('notification.form.success.fields');
    } catch (err) {
      console.error(err);
    }
  };

  const headerProps = {
    title: {
      label: formatMessage({ id: getTrad('settings.header.label') }),
    },
    content: formatMessage({
      id: getTrad('settings.sub-header.label'),
    }),
    actions: [
      {
        color: 'cancel',
        disabled: isEqual(initialData, modifiedData),
        // TradId from the strapi-admin package
        label: formatMessage({ id: 'app.components.Button.cancel' }),
        onClick: () => {
          dispatch({
            type: 'CANCEL_CHANGES',
          });
        },
        type: 'button',
      },
      {
        disabled: false,
        color: 'success',
        // TradId from the strapi-admin package
        label: formatMessage({ id: 'app.components.Button.save' }),
        onClick: handleSubmit,
        type: 'button',
      },
    ],
  };

  const handleChange = ({ target: { name, value } }) => {
    dispatch({
      type: 'ON_CHANGE',
      keys: name,
      value,
    });
  };

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <>
      <Header {...headerProps} />
      <Wrapper>
        <div className="container">
          <div className="row">
            <SectionTitleWrapper className="col-12">
              <Text fontSize="xs" fontWeight="semiBold" color="#787E8F">
                {formatMessage({ id: getTrad('settings.section.image.label') })}
              </Text>
            </SectionTitleWrapper>
            <div className="col-6">
              <Inputs
                label={formatMessage({
                  id: getTrad('settings.form.responsiveDimensions.label'),
                })}
                description={formatMessage({
                  id: getTrad('settings.form.responsiveDimensions.description'),
                })}
                name="responsiveDimensions"
                onChange={handleChange}
                type="bool"
                value={modifiedData.responsiveDimensions}
              />
            </div>
            <div className="col-6">
              <Inputs
                label={formatMessage({
                  id: getTrad('settings.form.sizeOptimization.label'),
                })}
                name="sizeOptimization"
                onChange={handleChange}
                type="bool"
                value={modifiedData.sizeOptimization}
              />
            </div>
          </div>
          <Divider />
          <div className="row">
            <SectionTitleWrapper className="col-12">
              <Text fontSize="xs" fontWeight="semiBold" color="#787E8F">
                {formatMessage({ id: getTrad('settings.section.video.label') })}
              </Text>
            </SectionTitleWrapper>
            <div className="col-6">
              <Inputs
                label={formatMessage({
                  id: getTrad('settings.form.videoPreview.label'),
                })}
                description={formatMessage({
                  id: getTrad('settings.form.videoPreview.description'),
                })}
                name="videoPreview"
                onChange={handleChange}
                type="bool"
                value={modifiedData.videoPreview}
              />
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default SettingsPage;
