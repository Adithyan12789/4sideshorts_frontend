import { Box, Modal, Typography } from '@mui/material';
import { closeDialog } from '../../store/dialogueSlice';
import Input from '../../extra/Input';
import Button from '../../extra/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  addDailyRewardCoin,
  editDailyRewardCoin,
  getDailyRewardCoin,
} from '../../store/rewardSlice';
import { toast } from 'react-toastify';
import Selector from '../../extra/Selector';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 520,
  maxHeight: '80vh',
  overflow: 'hidden',
  background: "linear-gradient(135deg, #e83a57 0%, #ec4863ff 100%)",
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
  display: 'flex',
  flexDirection: 'column',
};

const DailyRewardCoinDialogue = () => {
  const { dialogue: open } = useSelector((state) => state.dialogue);
  
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  
  const [day, setDay] = useState();
  const [dailyRewardCoin, setDailyRewardCoin] = useState();
  const { dialogueData } = useSelector((state) => state.dialogue);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    setDay(dialogueData?.day);
    setDailyRewardCoin(dialogueData?.dailyRewardCoin);
  }, [dialogueData]);
  
  const validation = () => {
    let error = {};
    let isValid = true;
    if (!day) {
      isValid = false;
      error['day'] = 'Please enter day';
    }
    if (!dailyRewardCoin) {
      isValid = false;
      error['dailyRewardCoin'] = 'Please enter daily reward coin';
    }
    setErrors(error);
    return isValid;
  };
  
  const handleSubmit = () => {
    if (validation()) {
      if (dialogueData) {
        const data = {
          dailyRewardCoin: dailyRewardCoin,
          dailyRewardCoinId: dialogueData?._id,
        };
        dispatch(editDailyRewardCoin(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            dispatch(closeDialog());
            dispatch(getDailyRewardCoin());
          } else {
            toast.error(res?.payload?.message);
          }
        });
      } else {
        const data = {
          day: day,
          dailyRewardCoin: dailyRewardCoin,
        };
        dispatch(addDailyRewardCoin(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            dispatch(getDailyRewardCoin());
          } else {
            toast.error(res?.payload?.message);
          }
          dispatch(closeDialog());
        });
      }
    }
  };
  
  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseAds}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modern-daily-reward-modal">
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
              }}>📅</span>
              {dialogueData ? 'Edit Daily Reward' : 'Create Daily Reward'}
            </Typography>
            <Typography variant="body2" style={{
              opacity: 0.9,
              marginTop: '4px',
              fontSize: '0.9rem'
            }}>
              {dialogueData ? 'Update daily coin reward settings' : 'Set up daily coin rewards for consecutive login days'}
            </Typography>
          </div>

          {/* Body Content */}
          <div className="modal-body" style={{
            backgroundColor: 'white',
            padding: '32px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            <form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Day Selector */}
                <div>
                  <Selector
                    label={'Day'}
                    name={'day'}
                    placeholder={'Select Day...'}
                    selectValue={day}
                    type={'number'}
                    selectData={['1', '2', '3', '4', '5', '6', '7']}
                    disabled={dialogueData ? true : false}
                    onChange={(e) => {
                      setDay(parseInt(e.target.value));
                      setErrors({ ...errors, day: '' });
                    }}
                    style={{
                      marginBottom: '4px',
                      borderRadius: '8px'
                    }}
                  />
                  {errors?.day && (
                    <span style={{ 
                      fontSize: '13px', 
                      color: '#e83a57',
                      display: 'block',
                      marginTop: '4px',
                      fontWeight: '500'
                    }}>
                      {errors?.day}
                    </span>
                  )}
                </div>

                {/* Daily Reward Coin Input */}
                <div>
                  <Input
                    type={'number'}
                    label={'Daily Reward Coins'}
                    name={'dailyRewardCoin'}
                    onChange={(e) => {
                      setDailyRewardCoin(parseInt(e.target.value, 10));
                      setErrors({ ...errors, dailyRewardCoin: '' });
                    }}
                    value={dailyRewardCoin}
                    style={{ 
                      marginBottom: '4px',
                      borderRadius: '8px'
                    }}
                    placeholder="Enter coin amount"
                  />
                  {errors?.dailyRewardCoin && (
                    <span style={{ 
                      fontSize: '13px', 
                      color: '#e83a57',
                      display: 'block',
                      marginTop: '4px',
                      fontWeight: '500'
                    }}>
                      {errors?.dailyRewardCoin}
                    </span>
                  )}
                </div>

                {/* Info Box */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  marginTop: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>💡</span>
                    <Typography variant="body2" style={{ 
                      fontSize: '0.85rem', 
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      {dialogueData 
                        ? 'Editing reward for Day ' + day 
                        : 'Day 1 = First login day, Day 7 = Highest reward'
                      }
                    </Typography>
                  </div>
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
        .modern-daily-reward-modal input, 
        .modern-daily-reward-modal select {
          border-radius: 8px !important;
          border: 1px solid #e0e0e0 !important;
          transition: all 0.3s ease !important;
          padding: 12px 16px !important;
        }
        
        .modern-daily-reward-modal input:focus,
        .modern-daily-reward-modal select:focus {
          border-color: #e83a57 !important;
          box-shadow: 0 0 0 2px rgba(232, 58, 87, 0.1) !important;
          outline: none !important;
        }
        
        .modern-daily-reward-modal .modal-body {
          scrollbar-width: thin;
          scrollbar-color: #e83a57 #f1f1f1;
        }
        
        .modern-daily-reward-modal .modal-body::-webkit-scrollbar {
          width: 6px;
        }
        
        .modern-daily-reward-modal .modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .modern-daily-reward-modal .modal-body::-webkit-scrollbar-thumb {
          background: #e83a57;
          border-radius: 3px;
        }
        
        /* Improve disabled state styling */
        .modern-daily-reward-modal select:disabled {
          background-color: #f8f9fa !important;
          color: #6c757d !important;
          border-color: #e9ecef !important;
        }
      `}</style>
    </div>
  );
};
export default DailyRewardCoinDialogue;