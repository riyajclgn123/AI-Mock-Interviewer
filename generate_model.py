from datasets import load_dataset
from transformers import GPT2Tokenizer, GPT2LMHeadModel, TextDataset, DataCollatorForLanguageModeling, Trainer, TrainingArguments

# Load dataset
print("Downloading dataset...")
dataset = load_dataset("ali-alkhars/interviews")
print(dataset["train"].column_names)
print(dataset["train"][0])


# Save Q&A to text file
print("Preparing data...")
with open("interview_data.txt", "w", encoding="utf-8") as f:
    for item in dataset["train"]:
        question = item['response'].strip().replace('\n', ' ')
        answer = "Your generated or collected answer here."
        f.write(f"Q: {question}\nA: {answer}\n\n")



# Load tokenizer and model
print("Loading GPT-2...")
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

# Load dataset for training
train_dataset = TextDataset(
    tokenizer=tokenizer,
    file_path="interview_data.txt",
    block_size=128,
)

data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer, mlm=False
)

# Training setup
training_args = TrainingArguments(
    output_dir="./mock-interviewer-model",
    overwrite_output_dir=True,
    num_train_epochs=3,
    per_device_train_batch_size=2,
    save_steps=500,
    save_total_limit=2,
    logging_dir="./logs",
)

# Train the model
print("Training...")
trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=train_dataset,
)
trainer.train()

# Save model locally
print("Saving model to 'mock-interviewer-model/'...")
model.save_pretrained("mock-interviewer-model")
tokenizer.save_pretrained("mock-interviewer-model")
print("Done!")
