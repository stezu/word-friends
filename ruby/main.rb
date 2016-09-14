DISTANCE = 1

require_relative 'lib/WordTree'
require_relative 'lib/WordSearch'

class WordFriends

  # return the number of friends since that's all the output we need
  def writeResults(network)

    network.each do |key, val|
      puts "#{val.length}"
    end
  end

  # find friends for the given input file
  def initialize
    network = {}
    tree = WordTree.new
    networkUndefined = true

    ARGF.each_line do |line|
      line.delete!("\n")

      if (line == "END OF INPUT")
        networkUndefined = false
      elsif (networkUndefined == true)
        network[line] = []
      else
        tree.insert(line)
      end
    end

    wordSearch = WordSearch.new(tree);

    network.each do |key, val|
      network[key] = wordSearch.search(key, DISTANCE).select do |result|
        result[:distance] == DISTANCE
      end
    end

    writeResults(network)
  end
end

WordFriends.new
