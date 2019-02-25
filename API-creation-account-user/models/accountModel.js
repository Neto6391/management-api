import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const Schema = mongoose.Schema;
const autoIncrement = mongooseSequence(mongoose);

const accountModel = new Schema(
	{
		_id: Number
	},
	{
		_id: false
	}
);

accountModel.plugin(autoIncrement, {
	collection_name: "account_counter"
});

export default mongoose.model("accounts", accountModel);
