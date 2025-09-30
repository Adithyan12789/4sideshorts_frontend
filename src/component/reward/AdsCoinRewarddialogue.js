import { Box, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAdsRewardCoin,
  editAddsRewardCoin,
  getAdsRewardCoin,
} from '../../store/rewardSlice';
import { closeDialog } from '../../store/dialogueSlice';
import Button from '../../extra/Button';
import Input from '../../extra/Input';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '80vh',
  overflow: 'hidden',
  background: "linear-gradient(135deg, #e83a57 0%, #ec4863ff 100%)",
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
  display: 'flex',
  flexDirection: 'column',
};

const AdsCoinRewarddialogue = () => {
  const dispatch = useDispatch();
  const { dialogueData } = useSelector((state) => state.dialogue);
  
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  
  useEffect(() => {
    setValues(dialogueData);
  }, [dialogueData]);
  
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  
  const validation = () => {
    let error = {};
    let isValid = true;
    if (!values?.adLabel) {
      isValid = false;
      error['adLabel'] = 'Please enter label';
    }
    if (!values?.adDisplayInterval) {
      isValid = false;
      error['adDisplayInterval'] = 'Please enter display interval';
    }
    if (!values?.coinEarnedFromAd) {
      isValid = false;
      error['coinEarnedFromAd'] = 'Please enter coin';
    }
    setErrors(error);
    return isValid;
  };
  
  const handleSubmit = () => {
    if (validation()) {
      if (dialogueData) {
        dispatch(editAddsRewardCoin(values)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            dispatch(closeDialog());
            dispatch(getAdsRewardCoin());
          } else {
            toast.error(res?.payload?.message);
          }
        });
      } else {
        dispatch(addAdsRewardCoin(values)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            dispatch(closeDialog());
            dispatch(getAdsRewardCoin());
          } else {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };
  
  const { dialogue: open } = useSelector((state) => state.dialogue);
  
  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseAds}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modern-ads-modal">
          {/* Header with Gradient Background */}
          <div className="modal-header" style={{
            background: "linear-gradient(135deg, #e83a57 0%, #ec4863ff 100%)",
            padding: '24px 32px 16px',
            color: 'white',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}>
            <Typography variant="h5" component="h2" style={{
              fontWeight: '600',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: 0
            }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>💰</span>
              {dialogueData ? 'Edit Ads Reward' : 'Create Ads Reward'}
            </Typography>
            <Typography variant="body2" style={{
              opacity: 0.9,
              marginTop: '4px',
              fontSize: '0.9rem'
            }}>
              {dialogueData ? 'Update your advertisement reward settings' : 'Configure new advertisement reward system'}
            </Typography>
          </div>

          {/* Body Content */}
          <div className="modal-body" style={{
            backgroundColor: 'white',
            padding: '32px',
            flex: 1,
            overflowY: 'auto',
          }}>
            <form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Ad Label Input */}
                <div>
                  <Input
                    type={'text'}
                    label={'Ad Label'}
                    onChange={handleInputChange}
                    name={'adLabel'}
                    value={values?.adLabel}
                    style={{ 
                      marginBottom: '4px',
                      borderRadius: '8px'
                    }}
                    placeholder="Enter a descriptive label for the ad"
                  />
                  {errors?.adLabel && (
                    <span style={{ 
                      fontSize: '13px', 
                      color: '#e83a57',
                      display: 'block',
                      marginTop: '4px',
                      fontWeight: '500'
                    }}>
                      {errors?.adLabel}
                    </span>
                  )}
                </div>

                {/* Display Interval Input */}
                <div>
                  <Input
                    type={'number'}
                    label={'Display Interval (seconds)'}
                    name={'adDisplayInterval'}
                    onChange={handleInputChange}
                    value={values?.adDisplayInterval}
                    style={{ 
                      marginBottom: '4px',
                      borderRadius: '8px'
                    }}
                    placeholder="Time between ad displays"
                  />
                  {errors?.adDisplayInterval && (
                    <span style={{ 
                      fontSize: '13px', 
                      color: '#e83a57',
                      display: 'block',
                      marginTop: '4px',
                      fontWeight: '500'
                    }}>
                      {errors?.adDisplayInterval}
                    </span>
                  )}
                </div>

                {/* Coin Earned Input */}
                <div>
                  <Input
                    type={'number'}
                    label={'Coins Earned per Ad'}
                    name={'coinEarnedFromAd'}
                    onChange={handleInputChange}
                    value={values?.coinEarnedFromAd}
                    style={{ 
                      marginBottom: '4px',
                      borderRadius: '8px'
                    }}
                    placeholder="Number of coins rewarded"
                  />
                  {errors?.coinEarnedFromAd && (
                    <span style={{ 
                      fontSize: '13px', 
                      color: '#e83a57',
                      display: 'block',
                      marginTop: '4px',
                      fontWeight: '500'
                    }}>
                      {errors?.coinEarnedFromAd}
                    </span>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Footer with Action Buttons */}
          <div className="modal-footer" style={{
            backgroundColor: '#f8f9fa',
            padding: '20px 32px',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            borderTop: '1px solid #e9ecef'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '12px',
              alignItems: 'center'
            }}>
              <Button
                onClick={handleCloseAds}
                btnName={'Cancel'}
                newClass={'close-model-btn'}
                style={{
                  border: '1px solid #dee2e6',
                  background: 'white',
                  color: '#6c757d',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: '500',
                  minWidth: '80px'
                }}
              />
              <Button
                onClick={handleSubmit}
                btnName={dialogueData ? 'Update' : 'Create'}
                type={'button'}
                newClass={'submit-btn'}
                style={{
                  background: "linear-gradient(135deg, #e83a57 0%, #ec4863ff 100%)",
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(232, 58, 87, 0.3)',
                  minWidth: '80px'
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>

      <style jsx>{`
        .modern-ads-modal input {
          border-radius: 8px !important;
          border: 1px solid #e0e0e0 !important;
          transition: all 0.3s ease !important;
          padding: 12px 16px !important;
        }
        
        .modern-ads-modal input:focus {
          border-color: #e83a57 !important;
          box-shadow: 0 0 0 2px rgba(232, 58, 87, 0.1) !important;
          outline: none !important;
        }
        
        .modern-ads-modal .modal-body {
          scrollbar-width: thin;
          scrollbar-color: #e83a57 #f1f1f1;
        }
        
        .modern-ads-modal .modal-body::-webkit-scrollbar {
          width: 6px;
        }
        
        .modern-ads-modal .modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .modern-ads-modal .modal-body::-webkit-scrollbar-thumb {
          background: #e83a57;
          border-radius: 3px;
        }
        
        /* Improve label styling */
        .modern-ads-modal .MuiInputLabel-root {
          font-weight: 500 !important;
          margin-bottom: 8px !important;
          color: #333 !important;
        }
      `}</style>
    </div>
  );
};
export default AdsCoinRewarddialogue;