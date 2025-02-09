import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["newOffer", "offerAccepted", "offerRejected"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object, // Optional: Store additional data like offerId, productId, etc.
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;