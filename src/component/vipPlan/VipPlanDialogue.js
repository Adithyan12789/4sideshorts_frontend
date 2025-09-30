import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogueSlice';
import { Box, Modal, Typography } from '@mui/material';
import Input from '../../extra/Input';
import { useEffect, useState } from 'react';
import Selector from '../../extra/Selector';
import Button from '../../extra/Button';
import {
  addVipPlan,
  getVipPlan,
  updateVipPlan,
} from '../../store/vipPlanSlice';
import { toast } from 'react-toastify';
import { max } from 'moment';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 720,
  maxHeight: '90vh',
  overflow: 'hidden',
  background: "linear-gradient(135deg, #e83a57 0%, #ec4863ff 100%)",
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
  display: 'flex',
  flexDirection: 'column',
};

const VipPlanDialogue = ({ page, size }) => {
  const dispatch = useDispatch();
  const [offerPrice, setOfferPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [productKey, setProductKey] = useState('');
  const [tags, setTags] = useState('');
  const [validityType, setValidityType] = useState('');
  const [validity, setValidity] = useState('');
  const [error, setError] = useState({});
  

  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  useEffect(() => {
    if (dialogueData) {
      setOfferPrice(dialogueData?.offerPrice);
      setAmount(dialogueData?.price);
      setProductKey(dialogueData?.productKey);
      setTags(dialogueData?.tags);
      setValidityType(dialogueData?.validityType);
      setValidity(dialogueData?.validity);
    }
  }, [dialogueData]);
  const validate = () => {
    let error = {};
    let isValid = true;
    if (!offerPrice) {
      isValid = false;
      error['offerPrice'] = 'Please enter offer price';
    }
    if (!amount) {
      isValid = false;
      error['amount'] = 'Please enter amount';
    }
    if (offerPrice > amount) {
      isValid = false;
      error['offerPrice'] = 'Offer price should be less than amount';
    }
    if (!validity) {
      isValid = false;
      error['validity'] = 'Please enter validity';
    }
    if (!validityType) {
      isValid = false;
      error['validityType'] = 'Please select validity type';
    }
    if (!productKey) {
      isValid = false;
      error['productKey'] = 'Please enter product key';
    }
    if (!tags) {
      isValid = false;
      error['tags'] = 'Please enter tags';
    }
    setError(error);
    return isValid;
  };
  const handleSubmit = () => {
    
    if (validate()) {
      let data = {
        offerPrice: offerPrice,
        price: amount,
        validityType: validityType,
        validity: validity,
        productKey: productKey,
        tags: tags,
        vipPlanId: dialogueData?._id,
      };
      if (dialogueData) {
        dispatch(updateVipPlan(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            handleCloseAds();
            dispatch(getVipPlan({ page, size }));
          } else {
            toast.error(res?.payload?.message);
          }
        });
      } else {
        dispatch(addVipPlan(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            handleCloseAds();
            dispatch(getVipPlan({ page, size }));
          } else {
            toast.error(res?.payload?.message);
          }
        });
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
          <Box sx={style} className="modern-modal">
            {/* Header with gradient background */}
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
                }}>👑</span>
                {dialogueData ? 'Edit VIP Plan' : 'Create VIP Plan'}
              </Typography>
              <Typography variant="body2" style={{
                opacity: 0.9,
                marginTop: '4px',
                fontSize: '0.9rem'
              }}>
                {dialogueData ? 'Update your premium membership details' : 'Add a new premium membership plan'}
              </Typography>
            </div>

            {/* Body with white background */}
            <div className="modal-body" style={{
              backgroundColor: 'white',
              padding: '32px',
              flex: 1,
              overflowY: 'auto',
              maxHeight: '60vh'
            }}>
              <form>
                <div className="row" style={{ 
                  gap: '20px 0',
                  margin: 0
                }}>
                  {/* Two-column layout for better space utilization */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <Input
                        type={'number'}
                        label={'Offer Price'}
                        onChange={(e) => {
                          setOfferPrice(e.target.value);
                          setError({ ...error, offerPrice: '' });
                        }}
                        name={'offerPrice'}
                        value={offerPrice}
                        style={{ marginBottom: '8px' }}
                      />
                      {error?.offerPrice && (
                        <span className="error" style={{ 
                          fontSize: '13px', 
                          color: '#e83a57',
                          display: 'block',
                          marginTop: '-4px'
                        }}>
                          {error?.offerPrice}
                        </span>
                      )}
                    </div>

                    <div>
                      <Input
                        type={'number'}
                        label={'Price'}
                        name={'price'}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setError({ ...error, amount: '' });
                        }}
                        value={amount}
                        style={{ marginBottom: '8px' }}
                      />
                      {error?.amount && (
                        <span className="error" style={{ 
                          fontSize: '13px', 
                          color: '#e83a57',
                          display: 'block',
                          marginTop: '-4px'
                        }}>
                          {error?.amount}
                        </span>
                      )}
                    </div>

                    <div>
                      <Input
                        type={'number'}
                        label={'Validity'}
                        onChange={(e) => {
                          setValidity(e.target.value);
                          setError({ ...error, validity: '' });
                        }}
                        name={'validity'}
                        value={validity}
                        style={{ marginBottom: '8px' }}
                      />
                      {error?.validity && (
                        <span className="error" style={{ 
                          fontSize: '13px', 
                          color: '#e83a57',
                          display: 'block',
                          marginTop: '-4px'
                        }}>
                          {error?.validity}
                        </span>
                      )}
                    </div>

                    <div>
                      <Selector
                        label={'Validity Type'}
                        name={'validityType'}
                        selectValue={validityType}
                        placeholder={'Select Validity Type'}
                        selectData={['month', 'year']}
                        onChange={(e) => {
                          setValidityType(e.target.value);
                          setError({ ...error, validityType: '' });
                        }}
                        style={{ marginBottom: '8px' }}
                      />
                      {error?.validityType && (
                        <span className="error" style={{ 
                          fontSize: '13px', 
                          color: '#e83a57',
                          display: 'block',
                          marginTop: '-4px'
                        }}>
                          {error?.validityType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Full width fields */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input
                      type={'text'}
                      label={'Tags'}
                      onChange={(e) => {
                        setTags(e.target.value);
                        setError({ ...error, tags: '' });
                      }}
                      name={'tags'}
                      value={tags}
                      style={{ marginBottom: '8px' }}
                      placeholder="Enter tags separated by commas"
                    />
                    {error?.tags && (
                      <span className="error" style={{ 
                        fontSize: '13px', 
                        color: '#e83a57',
                        display: 'block',
                        marginTop: '-4px'
                      }}>
                        {error?.tags}
                      </span>
                    )}
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input
                      type={'text'}
                      label={'Product Key'}
                      onChange={(e) => {
                        setProductKey(e.target.value);
                        setError({ ...error, productKey: '' });
                      }}
                      name={'productKey'}
                      value={productKey}
                      style={{ marginBottom: '8px' }}
                      placeholder="Enter unique product identifier"
                    />
                    {error?.productKey && (
                      <span className="error" style={{ 
                        fontSize: '13px', 
                        color: '#e83a57',
                        display: 'block',
                        marginTop: '-4px'
                      }}>
                        {error?.productKey}
                      </span>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Footer with subtle background */}
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
                    fontWeight: '500'
                  }}
                />
                <Button
                  onClick={handleSubmit}
                  btnName={dialogueData ? 'Update Plan' : 'Create Plan'}
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
                    width: '150px',
                    maxWidth: '150px',
                  }}
                />
              </div>
            </div>
          </Box>
        </Modal>
      </div>

      <style jsx>{`
        .modern-modal input, .modern-modal select {
          border-radius: 8px !important;
          border: 1px solid #e0e0e0 !important;
          transition: all 0.3s ease !important;
        }
        
        .modern-modal input:focus, .modern-modal select:focus {
          border-color: #e83a57 !important;
          box-shadow: 0 0 0 2px rgba(232, 58, 87, 0.1) !important;
        }
        
        .modern-modal .modal-body {
          scrollbar-width: thin;
          scrollbar-color: #e83a57 #f1f1f1;
        }
        
        .modern-modal .modal-body::-webkit-scrollbar {
          width: 6px;
        }
        
        .modern-modal .modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .modern-modal .modal-body::-webkit-scrollbar-thumb {
          background: #e83a57;
          border-radius: 3px;
        }
      `}</style>
    </>
  );
};
export default VipPlanDialogue;