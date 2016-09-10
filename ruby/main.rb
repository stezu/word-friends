DISTANCE = 1

require 'levenshtein'

class WordFriends

  def calculateLevenshteinDistance(first, second, maxDistance)

    # if one of the words doesn't exist, the distance
    # is the length of the other word
    return first if second.length == 0;
    return second if first.length == 0;

    # if the word length is further apart than the expected distance
    # we don't need to calculate the levenshtein distance, fail early
    if ((first.length - second.length).abs > maxDistance)
      return nil;
    end

    return Levenshtein.distance(first, second);
  end

  # loop through the words we care about and find words
  # with X distance using the levenshtein algorithm
  def findFriends(line, network)

    network.each do |key, val|
      distance = calculateLevenshteinDistance(key, line, DISTANCE);

      if (distance == DISTANCE)
        network[key].push(line);
      end
    end

    return network
  end

  # return the number of friends since that's all the output we need
  def writeResults(network)

    network.each do |key, val|
      puts "#{val.length}"
    end
  end

  # find friends for the given input file
  def initialize
    network = {}
    networkUndefined = true

    ARGF.each_line do |line|
      line.delete!("\n")

      if (line == "END OF INPUT")
        networkUndefined = false
      elsif (networkUndefined)
        network[line] = []
      else
        network = findFriends(line, network)
      end
    end

    writeResults(network)
  end
end

friends = WordFriends.new
