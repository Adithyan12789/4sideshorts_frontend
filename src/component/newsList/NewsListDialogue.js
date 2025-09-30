// frontend/NewsListDialogue.js

import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { closeDialog } from "../../store/dialogueSlice";
import {
  getNewsChannelList,
  getNewsChannelListVideo,
} from "../../store/newsChannelListSlice";
import { useEffect, useState } from "react";
import {
  addVideoList,
  editVideoList,
  getNewsList,
  uploadImage,
} from "../../store/newsListSlice";
import { useRouter } from "next/router";
import Male from "../../assets/images/placeHolder.png";
import { setToast } from "../../util/toastServices";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 720,
  maxWidth: "90vw",
  maxHeight: "90vh",
  backgroundColor: "background.paper",
  borderRadius: "12px",
  border: "none",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const NewsListDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [imagePath, setImagePath] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [videoDuration, setVideoDuration] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoInputType, setVideoInputType] = useState("upload");
  const [videoLink, setVideoLink] = useState("");
  const [movieSeriesId, setMovieSeriesId] = useState("");
  const [newsChannelList, setNewsChannelList] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coin, setCoin] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = useRouter();
  const userId = query.movieSeriesId;

  useEffect(() => {
    if (dialogueData) {
      setMovieSeriesId(dialogueData?.movieSeries?._id || dialogueData?._id);
      setImagePath(dialogueData?.videoImage);

      if (
        dialogueData?.videoUrl &&
        !dialogueData?.videoUrl.includes("/videos/")
      ) {
        setVideoInputType("link");
        setVideoLink(dialogueData.videoUrl);
      }

      // Use existing data instead of empty strings
      setName(dialogueData?.name || "");
      setDescription(dialogueData?.description || "");
      setCoin(dialogueData?.coin || 0);
    }
  }, [dialogueData]);

  const validation = () => {
    let error = {};
    let isValid = true;

    if (!name || name.trim() === "") {
      isValid = false;
      error["name"] = "Please enter a name";
    }

    if (!description || description.trim() === "") {
      isValid = false;
      error["description"] = "Please enter a description";
    }

    // Video input validation remains
    if (!dialogueData && videoInputType === "upload" && !selectedVideo) {
      isValid = false;
      error["video"] = "Please upload a video";
    } else if (!dialogueData && videoInputType === "link" && !videoLink) {
      isValid = false;
      error["video"] = "Please enter a video link";
    } else if (
      videoInputType === "link" &&
      videoLink &&
      !isValidUrl(videoLink)
    ) {
      isValid = false;
      error["video"] = "Please enter a valid video URL";
    }

    // Image is required
    if (!selectedImage && !dialogueData?.videoImage) {
      isValid = false;
      error["image"] = "Please upload a thumbnail image";
    }

    setErrors(error);
    return isValid;
  };

  const handleError = (msg, err = null) => {
    console.error(msg, err);
    setToast("error", msg);
    setErrors((prev) => ({ ...prev, submit: msg }));
    setIsSubmitting(false);
  };

  const handleVideo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, video: "Please select a video!" }));
      return;
    }

    const videoURL = URL.createObjectURL(file);
    setVideoPreviewUrl(videoURL);
    setSelectedVideo(file);
    setVideoLink("");

    const videoElement = document.createElement("video");
    videoElement.src = videoURL;

    videoElement.addEventListener("loadedmetadata", async () => {
      setVideoDuration(videoElement.duration);
    });

    setErrors({ ...errors, video: "" });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Please select a valid image file" });
      return;
    }

    setSelectedImage(file);
    setErrors({ ...errors, image: "" });

    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoLinkChange = (e) => {
    const link = e.target.value;
    setVideoLink(link);
    setSelectedVideo(null);
    setVideoPreviewUrl(null);

    if (link) {
      const videoElement = document.createElement("video");
      videoElement.src = link;
      videoElement.addEventListener("loadedmetadata", () => {
        setVideoDuration(videoElement.duration);
      });
      setErrors({ ...errors, video: "" });
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return null;
    return await uploadImageFile(selectedVideo, "newsVideos");
  };

  const handleCloseAds = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);

    setSelectedVideo(null);
    setSelectedImage(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoLink("");
    dispatch(closeDialog());
  };

  const uploadImageFile = async (file, folderName) => {
    try {
      const formData = new FormData();
      formData.append("folderStructure", `admin/${folderName}`);
      formData.append("keyName", file.name);
      formData.append("content", file);

      const response = await dispatch(uploadImage(formData));

      let fileUrl =
        response.payload?.data?.fileUrl ||
        response.payload?.fileUrl ||
        response.payload?.data?.url ||
        response.payload?.url ||
        response.payload?.data?.imageUrl ||
        response.payload?.imageUrl;

      if (response.payload && response.payload.status && fileUrl) {
        return {
          status: response.payload.status,
          fileUrl: fileUrl,
          message: response.payload.message,
        };
      }

      throw new Error(
        response.payload?.message || "Upload failed - no file URL received"
      );
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleProcessVideo = async () => {
    try {
      let finalVideoUrl = dialogueData?.videoUrl || "";
      let finalImage = dialogueData?.videoImage || "";

      // Process video
      if (videoInputType === "upload" && selectedVideo) {
        const uploadedVideoData = await uploadVideo();
        if (!uploadedVideoData?.status)
          throw new Error("Failed to upload video");
        finalVideoUrl = uploadedVideoData.fileUrl;
      } else if (videoInputType === "link" && videoLink) {
        finalVideoUrl = videoLink;
      }

      // Process image
      if (selectedImage) {
        const uploadedImageData = await uploadImageFile(
          selectedImage,
          "newsImages"
        );
        if (!uploadedImageData?.status)
          throw new Error("Failed to upload image");
        finalImage = uploadedImageData.fileUrl;
      } else if (!dialogueData) {
        throw new Error("Please upload a thumbnail image");
      }

      return { finalVideoUrl, finalImage };
    } catch (err) {
      handleError("Video processing failed", err);
      throw err;
    }
  };

  const handleEditSubmit = async () => {
    if (validation() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const { finalVideoUrl, finalImage } = await handleProcessVideo();

        const data = {
          movieSeriesId,
          name: name || dialogueData?.name,
          description: description || dialogueData?.description,
          duration: videoDuration || dialogueData?.duration,
          videoImage: finalImage || dialogueData?.videoImage,
          videoUrl: finalVideoUrl || dialogueData?.videoUrl,
          coin: coin || dialogueData?.coin || 0,
          shortVideoId: dialogueData?._id,
        };

        const res = await dispatch(editVideoList(data));

        if (res?.payload?.status) {
          setToast("success", res?.payload?.message);
          handleCloseAds();
        } else {
          setToast("error", res?.payload?.message || "Failed to update news");
        }
      } catch (error) {
        setErrors({ ...errors, submit: "Failed to submit form" });
      } finally {
        setIsSubmitting(false);
        handleCloseAds();
        dispatch(getNewsList({ page, size }));
        dispatch(getNewsChannelList({ page, size }));
        if (userId) {
          dispatch(
            getNewsChannelListVideo({
              start: page,
              limit: size,
              movieSeriesId: userId,
            })
          );
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (validation() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const { finalVideoUrl, finalImage } = await handleProcessVideo();

        const data = {
          movieSeriesId,
          name,
          description,
          duration: videoDuration ?? 0,
          videoImage: finalImage || "",
          videoUrl: finalVideoUrl || "",
          coin: coin ?? 0, // Optional if coin logic remains
          shortVideoId: dialogueData?._id, // For edit
        };

        const res = await dispatch(addVideoList(data));
        if (res?.payload?.status) {
          setToast("success", res?.payload?.message);
          handleCloseAds();
        } else {
          throw new Error(res?.payload?.message || "Add video failed");
        }
      } catch (err) {
        handleError("Failed to submit new news", err);
      } finally {
        setIsSubmitting(false);
        dispatch(getNewsList({ page, size }));
        dispatch(getNewsChannelList({ page, size }));
        dispatch(
          getNewsChannelListVideo({
            start: page,
            limit: size,
            movieSeriesId,
          })
        );
      }
    }
  };

  return (
    <div>
      <Modal open={open} onClose={handleCloseAds}>
        <Box sx={style}>
          <div
            className="model-header"
            style={{
              padding: "24px 24px 16px",
              borderBottom: "1px solid #f0f0f0",
              background: "linear-gradient(135deg, #e83a57 0%, #ec4863ff 100%)",
              color: "white",
            }}
          >
            <p
              className="m-0"
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                margin: 0,
              }}
            >
              {router?.pathname === "/newsChannelList"
                ? "Add News"
                : "Edit News"}
            </p>
            <p
              className="m-0"
              style={{
                fontSize: "0.875rem",
                opacity: 0.9,
                marginTop: "4px",
              }}
            >
              {router?.pathname === "/newsChannelList"
                ? "Create a new news for your series"
                : "Update news details and media"}
            </p>
          </div>

          <div
            className="model-body"
            style={{
              padding: "24px",
              overflowY: "auto",
              flex: 1,
              background: "#fafafa",
            }}
          >
            <form>
              <div className="row sound-add-box" style={{ gap: "16px" }}>
                <div className="form-group">
                  <Input
                    type="text"
                    label="Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ border: "1px solid #e9ecef", borderRadius: "8px" }}
                  />
                  {errors?.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <Input
                    type="text"
                    label="Description *"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ border: "1px solid #e9ecef", borderRadius: "8px" }}
                  />
                  {errors?.description && (
                    <span className="error">{errors.description}</span>
                  )}
                </div>

                <div className="form-group">
                  <Input
                    type="number"
                    label="Coin (optional)"
                    value={coin}
                    onChange={(e) => setCoin(Number(e.target.value))}
                    style={{ border: "1px solid #e9ecef", borderRadius: "8px" }}
                  />
                </div>

                {/* Video Input Type */}
                <div className="form-group">
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Video Input Type
                  </label>
                  <div className="d-flex" style={{ gap: "24px" }}>
                    <div
                      className="form-check"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="videoInputType"
                        id="uploadVideo"
                        value="upload"
                        checked={videoInputType === "upload"}
                        onChange={() => setVideoInputType("upload")}
                        style={{
                          marginRight: "8px",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="uploadVideo"
                        style={{
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Upload Video
                      </label>
                    </div>
                    <div
                      className="form-check"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="videoInputType"
                        id="videoLink"
                        value="link"
                        checked={videoInputType === "link"}
                        onChange={() => setVideoInputType("link")}
                        style={{
                          marginRight: "8px",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="videoLink"
                        style={{
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Video Link
                      </label>
                    </div>
                  </div>
                </div>

                {/* Upload Video */}
                {videoInputType === "upload" && (
                  <div className="form-group">
                    <Input
                      type="file"
                      label="Upload Video"
                      onChange={handleVideo}
                      accept="video/*"
                      style={{
                        border: "2px dashed #e9ecef",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    />
                    <div
                      className="preview-container"
                      style={{ marginTop: "16px" }}
                    >
                      {videoPreviewUrl && (
                        <video
                          src={videoPreviewUrl}
                          controls
                          className="rounded"
                          style={{
                            height: "120px",
                            width: "160px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      )}
                    </div>
                    {errors?.video && (
                      <span
                        className="error"
                        style={{
                          color: "#dc3545",
                          fontSize: "0.875rem",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        {errors?.video}
                      </span>
                    )}
                  </div>
                )}

                {/* Video Link */}
                {videoInputType === "link" && (
                  <div className="form-group">
                    <Input
                      type="text"
                      label="Video Link"
                      value={videoLink}
                      onChange={handleVideoLinkChange}
                      placeholder="Enter video URL"
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                      }}
                    />
                    {errors?.video && (
                      <span
                        className="error"
                        style={{
                          color: "#dc3545",
                          fontSize: "0.875rem",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        {errors?.video}
                      </span>
                    )}
                  </div>
                )}

                {/* Image Upload */}
                <div className="form-group">
                  <Input
                    type="file"
                    label="Upload Thumbnail Image *"
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{
                      border: "2px dashed #e9ecef",
                      borderRadius: "8px",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  />
                  {errors?.image && (
                    <span
                      className="error"
                      style={{
                        color: "#dc3545",
                        fontSize: "0.875rem",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors?.image}
                    </span>
                  )}
                </div>

                {/* Thumbnail Preview */}
                <div className="form-group">
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Thumbnail Preview
                  </label>
                  <div
                    className="preview-container"
                    style={{
                      border: "2px dashed #e9ecef",
                      borderRadius: "12px",
                      padding: "16px",
                      textAlign: "center",
                      background: "#fff",
                    }}
                  >
                    {imageError || (!thumbnailPreviewUrl && !imagePath) ? (
                      <img
                        src={Male.src}
                        style={{
                          width: "120px",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          opacity: 0.6,
                        }}
                        alt="Fallback Image"
                      />
                    ) : (
                      <img
                        src={thumbnailPreviewUrl || imagePath}
                        style={{
                          width: "120px",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                        alt="Thumbnail"
                        onError={() => setImageError(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div
            className="model-footer"
            style={{
              padding: "20px 24px",
              borderTop: "1px solid #f0f0f0",
              background: "#fff",
            }}
          >
            <div className="d-flex justify-content-end" style={{ gap: "12px" }}>
              <Button
                onClick={handleCloseAds}
                btnName="Close"
                newClass="close-model-btn"
                disabled={isSubmitting}
                style={{
                  borderRadius: "8px",
                  padding: "10px 24px",
                  border: "1px solid #6c757d",
                  color: "#6c757d",
                  background: "transparent",
                  fontWeight: "500",
                }}
              />
              <Button
                onClick={
                  router?.pathname === "/newsChannelList"
                    ? handleSubmit
                    : handleEditSubmit
                }
                btnName={isSubmitting ? "Submitting..." : "Submit"}
                type="button"
                newClass="submit-btn"
                style={{
                  borderRadius: "8px",
                  padding: "10px 24px",
                  background:
                    "linear-gradient(135deg, #e83a57 0%, #ec4863ff 100%)",
                  border: "none",
                  color: "white",
                  fontWeight: "500",
                  minWidth: "100px",
                }}
                disabled={isSubmitting}
              />
            </div>
            {errors?.submit && (
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <span
                  className="error"
                  style={{ color: "#dc3545", fontSize: "0.875rem" }}
                >
                  {errors?.submit}
                </span>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default NewsListDialogue;
