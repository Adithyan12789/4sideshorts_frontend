import { Box, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../store/dialogueSlice";
import { getNewsActiveCategory } from "../../store/newsCategorySlice";
import { toast } from "react-toastify";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import Selector from "../../extra/Selector";
import Male from "../../assets/images/placeHolder.png";
import {
  addNewsChannelList,
  editNewsChannelList,
  getNewsChannelList,
  uploadImage,
} from "../../store/newsChannelListSlice";
import { style } from "../../util/commonData";

const NewsChannelListDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  console.log(dialogueData ? true : false, "dialogueData");
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [maxAdsForFreeView, setMaxAdsForFreeView] = useState(0);
  // Separate state for poster and banner
  const [posterImagePath, setPosterImagePath] = useState(null);
  const [posterSelectedFile, setPosterSelectedFile] = useState(null);
  const [posterImagePreviewUrl, setPosterImagePreviewUrl] = useState(null);
  const [posterImageError, setPosterImageError] = useState(false);

  const [bannerImagePath, setBannerImagePath] = useState(null);
  const [bannerSelectedFile, setBannerSelectedFile] = useState(null);
  const [bannerImagePreviewUrl, setBannerImagePreviewUrl] = useState(null);
  const [bannerImageError, setBannerImageError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };

  useEffect(() => {
    dispatch(getNewsActiveCategory());
  }, []);

  const { newsActiveCategory } = useSelector((state) => state.newsCategory);

  const [errors, setErrors] = useState({});

  const validation = () => {
    let error = {};
    let isValid = true;
    if (!name) {
      isValid = false;
      error["name"] = "Please enter name";
    }
    if (!description) {
      isValid = false;
      error["description"] = "Please enter description";
    }
    if (!posterImagePath && !posterSelectedFile) {
      isValid = false;
      error["posterImage"] = "Please select a poster image";
    }
    if (!bannerImagePath && !bannerSelectedFile) {
      isValid = false;
      error["bannerImage"] = "Please select a banner image";
    }
    if (!category) {
      isValid = false;
      error["category"] = "Please enter category";
    }
    if (!maxAdsForFreeView) {
      isValid = false;
      error["maxAdsForFreeView"] = "Please enter max ads for free view";
    }
    setErrors(error);
    return isValid;
  };

  useEffect(() => {
    if (dialogueData) {
      setName(dialogueData?.name);
      setDescription(dialogueData?.description);
      setPosterImagePath(dialogueData?.thumbnail);
      setBannerImagePath(dialogueData?.banner);
      setCategory(dialogueData?.categoryId);
      setMaxAdsForFreeView(dialogueData?.maxAdsForFreeView);
    }
  }, [dialogueData]);

  // Separate file selection handlers for poster and banner
  const handlePosterFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPosterSelectedFile(file);
      setErrors({ ...errors, posterImage: "" });

      const localPreviewUrl = URL.createObjectURL(file);
      setPosterImagePreviewUrl(localPreviewUrl);
      setPosterImageError(false);
    }
  };

  const handleBannerFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBannerSelectedFile(file);
      setErrors({ ...errors, bannerImage: "" });

      const localPreviewUrl = URL.createObjectURL(file);
      setBannerImagePreviewUrl(localPreviewUrl);
      setBannerImageError(false);
    }
  };

  // Updated submit handler to upload both poster and banner
  const handleSubmit = async () => {
    
    if (!validation()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let finalPosterImagePath = posterImagePath;
      let finalBannerImagePath = bannerImagePath;

      // Upload poster image if a new file is selected
      if (posterSelectedFile) {
        const folderStructure = `admin/NewsChannelPoster`;

        const formData = new FormData();
        formData.append("folderStructure", folderStructure);
        formData.append("keyName", posterSelectedFile.name);
        formData.append("content", posterSelectedFile);

        const uploadResponse = await dispatch(uploadImage(formData)).unwrap();
        console.log("uploadResponse", uploadResponse);

        if (!uploadResponse?.data?.status) {
          toast.error("Failed to upload poster image");
          setIsSubmitting(false);
          return;
        }

        finalPosterImagePath = uploadResponse.data.url;
        console.log("finalPosterImagePath", finalPosterImagePath);
      }

      // Upload banner image if a new file is selected
      if (bannerSelectedFile) {
        const folderStructure = `admin/NewsChannelBanner`; 
        const formData = new FormData();
        formData.append("folderStructure", folderStructure);
        formData.append("keyName", bannerSelectedFile.name);
        formData.append("content", bannerSelectedFile);

        const uploadResponse = await dispatch(uploadImage(formData)).unwrap();

        if (!uploadResponse?.data?.status) {
          toast.error("Failed to upload banner image");
          setIsSubmitting(false);
          return;
        }

        finalBannerImagePath = uploadResponse.data.url;
      }

      // Prepare data with both poster and banner URLs
      const data = {
        name: name,
        description: description,
        category: category,
        thumbnail: finalPosterImagePath,
        banner: finalBannerImagePath,
        maxAdsForFreeView
      };

      const action = dialogueData ? editNewsChannelList(data) : addNewsChannelList(data);
      const response = await dispatch(action).unwrap();

      if (response?.status) {
        toast.success(response.message);
        handleCloseAds();
        dispatch(getNewsChannelList({ page, size }));
      } else {
        toast.error(response?.message || "An error occurred");
      }
    } catch (error) {
      toast.error("An error occurred while processing your request");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
    handleCloseAds();
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (posterImagePreviewUrl) {
        URL.revokeObjectURL(posterImagePreviewUrl);
      }
      if (bannerImagePreviewUrl) {
        URL.revokeObjectURL(bannerImagePreviewUrl);
      }
    };
  }, [posterImagePreviewUrl, bannerImagePreviewUrl]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseAds}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          ...style,
          width: 800,
          maxWidth: '90vw',
          maxHeight: '90vh',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
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
              letterSpacing: '-0.5px'
            }}>
              {dialogueData ? "Edit News Channel List" : "Add News Channel List"}
            </Typography>
            <Typography variant="body2" style={{
              opacity: 0.9,
              marginTop: '8px',
              fontSize: '0.95rem'
            }}>
              {dialogueData ? "Update News Channel details and media" : "Create a new News Channel entry"}
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
              <div className="sound-add-box" style={{ gap: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Left Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                      <Selector
                        label={"Category"}
                        name={"category"}
                        placeholder={"Select Category..."}
                        selectValue={category}
                        type={"number"}
                        selectData={
                          newsActiveCategory?.map((category) => ({
                            value: category._id,
                            label: category.name,
                          })) || []
                        }
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setErrors({ ...errors, category: "" });
                        }}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          background: '#fff'
                        }}
                      />
                      {errors?.category && (
                        <span style={{
                          color: '#e53e3e',
                          fontSize: '0.875rem',
                          marginTop: '8px',
                          display: 'block'
                        }}>
                          {errors?.category}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <Input
                        type={"text"}
                        label={"Name"}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors({ ...errors, name: "" });
                        }}
                        name={"name"}
                        value={name}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          background: '#fff',
                          padding: '12px 16px'
                        }}
                      />
                      {errors?.name && (
                        <span style={{
                          color: '#e53e3e',
                          fontSize: '0.875rem',
                          marginTop: '8px',
                          display: 'block'
                        }}>
                          {errors?.name}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <Input
                        type={"number"}
                        label={"Max Ads For Free View"}
                        onChange={(e) => {
                          setMaxAdsForFreeView(e.target.value);
                          setErrors({ ...errors, maxAdsForFreeView: "" });
                        }}
                        name={"maxAdsForFreeView"}
                        value={maxAdsForFreeView}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          background: '#fff',
                          padding: '12px 16px'
                        }}
                      />
                      {errors?.maxAdsForFreeView && (
                        <span style={{
                          color: '#e53e3e',
                          fontSize: '0.875rem',
                          marginTop: '8px',
                          display: 'block'
                        }}>
                          {errors?.maxAdsForFreeView}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                      <Input
                        type={"text"}
                        label={"Description"}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setErrors({ ...errors, description: "" });
                        }}
                        name={"description"}
                        value={description}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          background: '#fff',
                          padding: '12px 16px',
                          minHeight: '120px'
                        }}
                        multiline
                        rows={3}
                      />
                      {errors?.description && (
                        <span style={{
                          color: '#e53e3e',
                          fontSize: '0.875rem',
                          marginTop: '8px',
                          display: 'block'
                        }}>
                          {errors?.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Upload Section - Modern Two Column */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
                  {/* Poster Upload */}
                  <div className="image-upload-section">
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontWeight: '600',
                      color: '#2d3748'
                    }}>Poster Image *</label>
                    <Input
                      type={"file"}
                      accept={"image/*"}
                      onChange={handlePosterFileSelect}
                      style={{
                        border: '2px dashed #cbd5e0',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center',
                        background: '#f8fafc',
                        marginBottom: '16px'
                      }}
                    />
                    <div className="image-preview" style={{
                      border: '2px dashed #e2e8f0',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      background: '#fff'
                    }}>
                      {posterImageError || (!posterImagePath && !posterImagePreviewUrl) ? (
                        <img
                          src={Male.src}
                          style={{
                            width: '120px',
                            height: '160px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            opacity: 0.6
                          }}
                          alt="Fallback Poster"
                        />
                      ) : (
                        <img
                          src={posterImagePreviewUrl || posterImagePath}
                          style={{
                            width: '120px',
                            height: '160px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}
                          alt="Poster Thumbnail"
                          onError={() => setPosterImageError(true)}
                        />
                      )}
                    </div>
                    {errors?.posterImage && (
                      <span style={{
                        color: '#e53e3e',
                        fontSize: '0.875rem',
                        marginTop: '8px',
                        display: 'block'
                      }}>
                        {errors?.posterImage}
                      </span>
                    )}
                  </div>

                  {/* Banner Upload */}
                  <div className="image-upload-section">
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontWeight: '600',
                      color: '#2d3748'
                    }}>Banner Image *</label>
                    <Input
                      type={"file"}
                      accept={"image/*"}
                      onChange={handleBannerFileSelect}
                      style={{
                        border: '2px dashed #cbd5e0',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center',
                        background: '#f8fafc',
                        marginBottom: '16px'
                      }}
                    />
                    <div className="image-preview" style={{
                      border: '2px dashed #e2e8f0',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      background: '#fff'
                    }}>
                      {bannerImageError || (!bannerImagePath && !bannerImagePreviewUrl) ? (
                        <img
                          src={Male.src}
                          style={{
                            width: '120px',
                            height: '160px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            opacity: 0.6
                          }}
                          alt="Fallback Banner"
                        />
                      ) : (
                        <img
                          src={bannerImagePreviewUrl || bannerImagePath}
                          style={{
                            width: '120px',
                            height: '160px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}
                          alt="Banner Thumbnail"
                          onError={() => setBannerImageError(true)}
                        />
                      )}
                    </div>
                    {errors?.bannerImage && (
                      <span style={{
                        color: '#e53e3e',
                        fontSize: '0.875rem',
                        marginTop: '8px',
                        display: 'block'
                      }}>
                        {errors?.bannerImage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Modern Footer */}
          <div className="model-footer" style={{
            padding: '24px 32px',
            borderTop: '1px solid #e2e8f0',
            background: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <Button
                onClick={handleCloseAds}
                btnName={"Close"}
                newClass={"close-model-btn"}
                disabled={isSubmitting}
                style={{
                  borderRadius: '10px',
                  padding: '12px 28px',
                  border: '1px solid #cbd5e0',
                  color: '#4a5568',
                  background: 'transparent',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              />
              <Button
                onClick={handleSubmit}
                btnName={isSubmitting ? "Submitting..." : "Submit"}
                type={"button"}
                newClass={"submit-btn"}
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
  );
};

export default NewsChannelListDialogue;