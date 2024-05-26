

const generatePassword = function(name, email) {
    const lastThreeLetters = name.slice(-3).toLowerCase();
    const firstTwoLetters = email.slice(0, 2).toLowerCase();
    const randomString = Math.random().toString(36).substring(2, 6);
  
    return `${lastThreeLetters}${firstTwoLetters}${randomString}`;
  };

  module.exports = {
    generatePassword,
  }
  