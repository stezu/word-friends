
class WordSearch
  attr_reader :wordTree

  def initialize(wordTree)
    @wordTree = wordTree
  end

  def search(searchTerm, distance)
    currentRow = (0..searchTerm.length).to_a
    results = []

    @wordTree.children.each do |key, val|
      results = results.concat(getResults({
        :node => val,
        :letter => key,
        :previousRow => currentRow,
        :searchTerm => searchTerm,
        :distance => distance
      }))
    end

    results
  end

  private

  def getResults(options)
    columns = options[:searchTerm].length + 1
    currentRow = [options[:previousRow].first + 1]
    results = []

    # build out the row for the given letter
    (1..columns - 1).each do |i|
      currentRow.push(getCost({
        :column => i,
        :previousRow => options[:previousRow],
        :currentRow => currentRow,
        :searchTerm => options[:searchTerm],
        :letter => options[:letter]
      }))
    end

    # this word is the correct distance away, add it to the results array
    if (currentRow.last <= options[:distance] && options[:node].word.to_s != "")
      results.push({
        :word => options[:node].word,
        :distance => currentRow.last
      })
    end

    # if any items in the row are lower than the max distance, run the code again
    if (currentRow.min <= options[:distance])

      options[:node].children.each do |key, val|

        results = results.concat(getResults({
          :node => val,
          :letter => key,
          :previousRow => currentRow,
          :searchTerm => options[:searchTerm],
          :distance => options[:distance]
        }))
      end
    end

    results
  end

  # determine the levenshtein algorithm cost of the given letter
  def getCost(options)
    insertCost = options[:currentRow][options[:column] - 1] + 1
    deleteCost = options[:previousRow][options[:column]] + 1

    if (options[:searchTerm][options[:column] - 1] === options[:letter])
      replaceCost = options[:previousRow][options[:column] - 1]
    else
      replaceCost = options[:previousRow][options[:column] - 1] + 1
    end

    [insertCost, deleteCost, replaceCost].min
  end
end
