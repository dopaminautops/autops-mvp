from datasets import load_dataset
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, DataCollatorForSeq2Seq, Seq2SeqTrainer, Seq2SeqTrainingArguments

MODEL_NAME = "t5-small"
DATA_PATH = "training/data.jsonl"
OUTPUT_DIR = "training/output-model"


def preprocess(batch, tokenizer):
    model_inputs = tokenizer(batch["input"], max_length=256, truncation=True)
    labels = tokenizer(text_target=batch["output"], max_length=256, truncation=True)
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs


def main():
    dataset = load_dataset("json", data_files=DATA_PATH)["train"]
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenized = dataset.map(lambda x: preprocess(x, tokenizer), batched=True)

    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
    args = Seq2SeqTrainingArguments(
        output_dir=OUTPUT_DIR,
        learning_rate=3e-4,
        per_device_train_batch_size=8,
        num_train_epochs=3,
        save_strategy="epoch",
        logging_steps=10,
        fp16=False,
    )
    trainer = Seq2SeqTrainer(
        model=model,
        args=args,
        train_dataset=tokenized,
        data_collator=DataCollatorForSeq2Seq(tokenizer, model=model),
        tokenizer=tokenizer,
    )
    trainer.train()
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)


if __name__ == "__main__":
    main()
