# Withdraw without any incident 
# 120 - 10 - 0.5 - 1% = floor(109.4) = 109
# 109 - 20 - 0.5 - 1% = floor(88.3) = 88
# 88 - 30 - 0.5 - 1% = floor(57.2) = 57

def checkio(data):
    balance, withdrawal = data
    for e in withdrawal:
        if e % 5 != 0 or balance - e - 0.5 - e * 0.01 < 0: continue
        balance = int(balance - e - 0.5 - e * 0.01)
    return balance
    

if __name__ == '__main__':
    assert checkio([120, [10 , 20, 30]]) == 57, 'First'

    # With one Insufficient Funds, and then withdraw 10 $
    assert checkio([120, [200 , 10]]) == 109, 'Second'

    #with one incorrect amount
    assert checkio([120, [3, 10]]) == 109, 'Third'

    assert checkio([120, [200, 119]]) == 120 , 'Fourth'

    assert checkio([120, [120, 10, 122, 2, 10, 10, 30, 1]]) == 56, "It's mixed all base tests"
    
