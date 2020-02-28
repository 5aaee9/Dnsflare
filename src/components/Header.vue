<template>
    <HHeader
        theme="dark"
        class="app-header"
    >
        <p>Dnsflare</p>
        <div class="header-right">
            <a href="https://github.com/Indexyz/Dnsflare">GitHub</a>
        </div>
    </HHeader>
</template>

<style lang="scss" scoped>
    @mixin item {
        margin: auto 0;
        cursor: pointer;
        transition: .3s;

        padding: 0 30px;

        &:hover {
            color: #77A2DC;
        }
    }


    .app-header {
        display: flex;
        padding-left: 40px;

        > p {
            @include item;
        }

        .header-right {
            margin-left: auto;
            margin-right: 40px;
            display: grid;

            > * {
                @include item;
            }
        }
    }
</style>
