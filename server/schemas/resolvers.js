const { AuthenticationError } = require('apollo-server-express');
const { User, Quiz, Category, Question } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate('quizzes');

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addQuiz: async (parent, {score}, context) => {
      const quiz = await Quiz.create({score});
      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet:{quizzes: quiz._id}},
        { new: true }
      )
      return user;
    }
  }
};


module.exports = resolvers;
