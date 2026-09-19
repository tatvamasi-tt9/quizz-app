const mongoose=require('mongoose');

const QuizSession=new mongoose.Schema({
   
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
    // id linking back to the Chunk documents (RAG source chunks) this quiz
    // was generated from - useful for debugging/regeneration, not required
    sourceDocId: {
        type: String,
        default: null
    },
    // The retrieved context chunks (text only) used to generate this quiz.
    // Kept on the quiz itself - not just in the transient Chunk collection,
    // which auto-expires after 2 hours - so a "practice weak areas" re-quiz
    // can still be generated from the same source material later.
    sourceContext: {
        type: [String],
        default: []
    },
    title: {
        type: String,
        default: "Untitled Quiz"
    },
    difficulty: {
        type: String,
        default: "medium"
    },
    questions: [
        {
            question: {
            type: String,
            required: true
        },
        options: {
            type: [String],
            required: true
        },
        correctAnswer: {
            type: String,
            required: true
        },
        // Short concept/topic label (e.g. "Deadlock", "Paging") used to
        // group questions for the weak-area breakdown on the result page.
        topic: {
            type: String,
            default: "General"
        }
        }
    ],
    // Topics this quiz was deliberately generated to focus on - only set
    // for "practice weak areas" quizzes.
    focusTopics: {
        type: [String],
        default: []
    },
    // If this quiz is a reattempt or weak-area practice round generated
    // from another quiz, this points back to the original.
    parentQuizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizSession",
        default: null
    },
    currentQuestion:{
        type:Number,
        default:0
    } ,
    answers: {
        type: [String],
    default: []
    },
    status: {
    type: String,
    default: "in_progress"
  },
    createdAt: {
    type: Date,
    default: Date.now
  },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    timeTaken: {
    type: Number,
    default: 0
  }
})

const Quizmodel=mongoose.model('QuizSession',QuizSession);
module.exports=Quizmodel