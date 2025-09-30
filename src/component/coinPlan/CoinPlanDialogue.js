import { Box, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../extra/Input';
import { useEffect, useState } from 'react';
import { closeDialog } from '../../store/dialogueSlice';
import Button from '../../extra/Button';
import {
  addCoinPlan,
  getCoinPlan,
  updateCoinPlan,
} from '../../store/coinPlanSlice';
import { toast } from 'react-toastify';

// SVG Icons
const CoinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 9.5C15 10.8807 13.6569 12 12 12C10.3431 12 9 10.8807 9 9.5C9 8.11929 10.3431 7 12 7C13.6569 7 15 8.11929 15 9.5Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 9.5V12.5C9 13.8807 10.3431 15 12 15C13.6569 15 15 13.8807 15 12.5V9.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const BonusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 22V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17.6569 6.34314L19.0711 4.92893" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.92893 19.0711L6.34314 17.6569" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17.6569 17.6569L19.0711 19.0711" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.92893 4.92893L6.34314 6.34314" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PriceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8C16 9.10457 15.1046 10 14 10C12.8954 10 12 9.10457 12 8C12 6.89543 12.8954 6 14 6C15.1046 6 16 6.89543 16 8Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16C12 17.1046 11.1046 18 10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const OfferIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 3V9" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 3V9" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 15V21" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 15V21" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 15C17.2091 15 19 13.2091 19 11C19 8.79086 17.2091 7 15 7C12.7909 7 11 8.79086 11 11C11 11.3417 11.0348 11.6754 11.101 12H7C5.89543 12 5 12.8954 5 14V17C5 18.1046 5.89543 19 7 19H17C18.1046 19 19 18.1046 19 17V16.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 520,
  maxWidth: '90vw',
  maxHeight: '90vh',
  backgroundColor: 'background.paper',
  borderRadius: '16px',
  border: 'none',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const CoinPlanDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const [coin, setCoin] = useState('');
  const [bonusCoin, setBonusCoin] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [error, setError] = useState({});
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const [productKey, setProductKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  
  const validate = () => {
    let error = {};
    let isValid = true;
    if (!offerPrice) {
      isValid = false;
      error.offerPrice = 'Offer Price Is Required !';
    }
    if (!bonusCoin) {
      isValid = false;
      error.bonusCoin = 'Bonus Coin Is Required !';
    }
    if (!amount) {
      isValid = false;
      error.amount = 'Amount Is Required !';
    }
    if (!productKey) {
      isValid = false;
      error.productKey = 'Product Key Is Required !';
    }
    if (!coin) {
      isValid = false;
      error.coin = 'Coin Is Required !';
    }
    if (+offerPrice > +amount) {
      isValid = false;
      error['offerPrice'] = 'Offer price should be less than amount';
    }
    setError(error);
    return isValid;
  };

  useEffect(() => {
    if (dialogueData) {
      setCoin(dialogueData?.coin);
      setBonusCoin(dialogueData?.bonusCoin);
      setOfferPrice(dialogueData?.offerPrice);
      setAmount(dialogueData?.price);
      setProductKey(dialogueData?.productKey);
    }
  }, [dialogueData]);

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        let data = {
          offerPrice: +offerPrice,
          bonusCoin: +bonusCoin,
          price: +amount,
          productKey: productKey,
          coin: coin,
          coinPlanId: dialogueData?._id,
        };
        
        if (dialogueData) {
          const res = await dispatch(updateCoinPlan(data)).unwrap();
          if (res?.status) {
            toast.success(res?.message);
            handleCloseAds();
            dispatch(getCoinPlan({ page, size }));
          } else {
            toast.error(res?.message || 'Update failed');
          }
        } else {
          const res = await dispatch(addCoinPlan(data)).unwrap();
          if (res?.status) {
            toast.success(res?.message);
            handleCloseAds();
            dispatch(getCoinPlan({ page, size }));
          } else {
            toast.error(res?.message || 'Add failed');
          }
        }
      } catch (error) {
        toast.error('An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleCloseAds}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="">
            {/* Modern Header with Gradient */}
            <div className="model-header" style={{
              padding: '28px 32px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(135deg, #e83a57 0%, #ec4863ff 100%)',
              color: 'white',
            }}>
              <Typography variant="h5" component="h2" style={{
                fontWeight: '700',
                margin: 0,
                fontSize: '1.75rem',
                letterSpacing: '-0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CoinIcon />
                {dialogueData ? 'Edit Coin Plan' : 'Add Coin Plan'}
              </Typography>
              <Typography variant="body2" style={{
                opacity: 0.9,
                marginTop: '8px',
                fontSize: '0.95rem',
                marginLeft: '32px'
              }}>
                {dialogueData ? 'Update coin package details' : 'Create a new coin package'}
              </Typography>
            </div>

            {/* Modern Body */}
            <div className="model-body" style={{
              padding: '32px',
              overflowY: 'auto',
              flex: 1,
              background: '#fafafa'
            }}>
              <form>
                <div className="sound-add-box" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '24px' 
                }}>
                  {/* Two Column Grid for Inputs */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '20px' 
                  }}>
                    {/* Bonus Coin */}
                    <div className="input-group">
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#2d3748',
                        fontSize: '0.95rem'
                      }}>
                        <BonusIcon />
                        Bonus Coin *
                      </label>
                      <Input
                        type={'number'}
                        onChange={(e) => {
                          setBonusCoin(e.target.value);
                          setError({ ...error, bonusCoin: '' });
                        }}
                        name={'bonusCoin'}
                        value={bonusCoin}
                        placeholder="Enter bonus coins"
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          background: '#fff',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                      {error?.bonusCoin && (
                        <span style={{
                          color: '#e53e3e',
                          fontSize: '0.875rem',
                          marginTop: '6px',
                          display: 'block'
                        }}>
                          {error?.bonusCoin}
                        </span>
                      )}
                    </div>

                    {/* Coin */}
                    <div className="input-group">
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#2d3748',
                        fontSize: '0.95rem'
                      }}>
                        <CoinIcon />
                        Coin *
                      </label>
                      <Input
                        type={'number'}
                        onChange={(e) => {
                          setCoin(e.target.value);
                          setError({ ...error, coin: '' });
                        }}
                        name={'coin'}
                        value={coin}
                        placeholder="Enter coins"
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          background: '#fff',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                      {error?.coin && (
                        <span style={{
                          color: '#e53e3e',
                          fontSize: '0.875rem',
                          marginTop: '6px',
                          display: 'block'
                        }}>
                          {error?.coin}
                        </span>
                      )}
                    </div>

                    {/* Offer Price */}
                    <div className="input-group">
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#2d3748',
                        fontSize: '0.95rem'
                      }}>
                        <OfferIcon />
                        Offer Price *
                      </label>
                      <Input
                        type={'number'}
                        onChange={(e) => {
                          setOfferPrice(e.target.value);
                          setError({ ...error, offerPrice: '' });
                        }}
                        name={'offerPrice'}
                        value={offerPrice}
                        placeholder="Enter offer price"
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          background: '#fff',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                      {error?.offerPrice && (
                        <span style={{
                          color: '#e53e3e',
                          fontSize: '0.875rem',
                          marginTop: '6px',
                          display: 'block'
                        }}>
                          {error?.offerPrice}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="input-group">
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#2d3748',
                        fontSize: '0.95rem'
                      }}>
                        <PriceIcon />
                        Price *
                      </label>
                      <Input
                        type={'number'}
                        name={'price'}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setError({ ...error, amount: '' });
                        }}
                        value={amount}
                        placeholder="Enter actual price"
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          background: '#fff',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                      {error?.amount && (
                        <span style={{
                          color: '#e53e3e',
                          fontSize: '0.875rem',
                          marginTop: '6px',
                          display: 'block'
                        }}>
                          {error?.amount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Key - Full Width */}
                  <div className="input-group">
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#2d3748',
                      fontSize: '0.95rem'
                    }}>
                      <KeyIcon />
                      Product Key *
                    </label>
                    <Input
                      type={'text'}
                      onChange={(e) => {
                        setProductKey(e.target.value);
                        setError({ ...error, productKey: '' });
                      }}
                      name={'productKey'}
                      value={productKey}
                      placeholder="Enter product key identifier"
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        background: '#fff',
                        padding: '12px 16px',
                        fontSize: '1rem',
                        width: '100%'
                      }}
                    />
                    {error?.productKey && (
                      <span style={{
                        color: '#e53e3e',
                        fontSize: '0.875rem',
                        marginTop: '6px',
                        display: 'block'
                      }}>
                        {error?.productKey}
                      </span>
                    )}
                  </div>

                  {/* Validation Note */}
                  {error?.offerPrice && error.offerPrice.includes('less than amount') && (
                    <div style={{
                      background: '#fed7d7',
                      border: '1px solid #feb2b2',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#c53030',
                      fontSize: '0.875rem'
                    }}>
                      💡 Offer price must be less than the actual price to create a valid discount.
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modern Footer */}
            <div className='model-footer' style={{
              padding: '24px 32px',
              borderTop: '1px solid #e2e8f0',
              background: '#fff'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '16px' 
              }}>
                <Button
                  onClick={handleCloseAds}
                  btnName={'Close'}
                  newClass={'close-model-btn'}
                  disabled={isSubmitting}
                  style={{
                    borderRadius: '10px',
                    padding: '12px 28px',
                    border: '1px solid #cbd5e0',
                    color: '#4a5568',
                    background: 'transparent',
                    fontWeight: '600',
                    fontSize: '1rem',
                    minWidth: '100px'
                  }}
                />
                <Button
                  onClick={handleSubmit}
                  btnName={isSubmitting ? 'Processing...' : 'Submit'}
                  type={'button'}
                  newClass={'submit-btn'}
                  disabled={isSubmitting}
                  style={{
                    borderRadius: '10px',
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #e83a57 0%, #ec4863ff 100%)',
                    border: 'none',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1rem',
                    minWidth: '120px',
                    boxShadow: '0 4px 12px rgba(232, 58, 87, 0.3)'
                  }}
                />
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default CoinPlanDialogue;